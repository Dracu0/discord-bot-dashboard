const { WebSocketServer } = require('ws');
const logger = require('./logger');
const { getSubscriber } = require('./redis');

let wss = null;

/**
 * Parse the session from the HTTP upgrade request using the same
 * session middleware the Express app uses. Returns the session or null.
 */
function parseSession(httpServer, req) {
    return new Promise((resolve) => {
        // The Express session middleware is stored on the app
        const app = httpServer._app;
        if (!app || !app._sessionMiddleware) {
            resolve(null);
            return;
        }
        // Create a minimal response object for the middleware
        const res = { setHeader() {}, end() {} };
        app._sessionMiddleware(req, res, () => {
            resolve(req.session || null);
        });
    });
}

/**
 * Attach a WebSocket server to the existing HTTP server.
 * Subscribes to Redis pub/sub and broadcasts events to dashboard clients.
 * No-op if REDIS_URL is not set.
 *
 * @param {import('http').Server} httpServer
 */
function startWebSocketServer(httpServer) {
    if (!process.env.REDIS_URL) {
        logger.info('websocket_skipped', { reason: 'REDIS_URL not configured' });
        return;
    }

    wss = new WebSocketServer({
        server: httpServer,
        path: '/ws',
        // Authenticate on upgrade — reject unauthenticated connections
        verifyClient: async ({ req }, done) => {
            try {
                const session = await parseSession(httpServer, req);
                if (session?.passport?.user) {
                    done(true);
                } else {
                    logger.warn('ws_auth_rejected', { ip: req.socket.remoteAddress });
                    done(false, 401, 'Unauthorized');
                }
            } catch (err) {
                logger.error('ws_auth_error', { error: err });
                done(false, 500, 'Internal error');
            }
        },
    });

    wss.on('connection', (ws, req) => {
        ws.isAlive = true;
        ws.subscribedGuilds = new Set(); // Track which guilds this client cares about
        ws.on('pong', () => { ws.isAlive = true; });
        ws.on('error', (err) => {
            logger.warn('ws_client_error', { error: err.message });
        });

        // Handle client messages (e.g. guild subscription)
        ws.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw);
                if (msg.type === 'subscribe_guild' && typeof msg.guildId === 'string' && /^\d{17,20}$/.test(msg.guildId)) {
                    ws.subscribedGuilds.add(msg.guildId);
                } else if (msg.type === 'unsubscribe_guild' && typeof msg.guildId === 'string') {
                    ws.subscribedGuilds.delete(msg.guildId);
                }
            } catch {
                // Ignore invalid messages
            }
        });

        // Send an initial connected event
        safeSend(ws, { type: 'connected', timestamp: Date.now() });
    });

    // Heartbeat: detect dead connections every 30s
    const heartbeat = setInterval(() => {
        for (const ws of wss.clients) {
            if (!ws.isAlive) {
                ws.terminate();
                continue;
            }
            ws.isAlive = false;
            ws.ping();
        }
    }, 30000);

    wss.on('close', () => clearInterval(heartbeat));

    // Subscribe to Redis channels
    const sub = getSubscriber();
    if (sub) {
        sub.subscribe('bot:status', 'config:invalidate', (err) => {
            if (err) {
                logger.warn('ws_redis_subscribe_failed', { error: err.message });
                return;
            }
            logger.info('ws_redis_subscribed', { channels: ['bot:status', 'config:invalidate'] });
        });

        sub.on('message', (channel, message) => {
            if (channel === 'bot:status') {
                // Bot status goes to all clients
                broadcast({ type: 'bot:status', data: tryParse(message) });
            } else if (channel === 'config:invalidate') {
                // Config invalidation — only send to clients subscribed to this guild
                broadcastToGuild(message, { type: 'config:invalidate', guildId: message });
            }
        });
    }

    logger.info('websocket_server_started', { path: '/ws' });
}

/** Broadcast to all connected clients */
function broadcast(payload) {
    if (!wss) return;
    const data = JSON.stringify(payload);
    for (const ws of wss.clients) {
        if (ws.readyState === 1) { // OPEN
            ws.send(data);
        }
    }
}

/** Broadcast only to clients subscribed to a specific guild */
function broadcastToGuild(guildId, payload) {
    if (!wss) return;
    const data = JSON.stringify(payload);
    for (const ws of wss.clients) {
        if (ws.readyState === 1 && ws.subscribedGuilds?.has(guildId)) {
            ws.send(data);
        }
    }
}

function safeSend(ws, payload) {
    if (ws.readyState === 1) {
        ws.send(JSON.stringify(payload));
    }
}

function tryParse(str) {
    try { return JSON.parse(str); } catch { return str; }
}

function stopWebSocketServer() {
    if (wss) {
        wss.close();
        wss = null;
    }
}

module.exports = { startWebSocketServer, stopWebSocketServer, broadcast };
