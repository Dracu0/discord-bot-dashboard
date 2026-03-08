const { WebSocketServer } = require('ws');
const logger = require('./logger');
const { getSubscriber } = require('./redis');
const { hasManageGuild } = require('./permissions');

let wss = null;
let latestBotStatus = null;
let healthPollInterval = null;
let presenceCleanupInterval = null;
// Track active presence: Map<guildId, Map<sessionId, { userId, username, avatar, page, lastSeen }>>
const guildPresence = new Map();

/**
 * Parse the session from the HTTP upgrade request using the same
 * session middleware the Express app uses. Returns the session or null.
 */
let _sessionMiddleware = null;

function parseSession(req) {
    return new Promise((resolve) => {
        if (!_sessionMiddleware) {
            resolve(null);
            return;
        }
        // Create a minimal response object for the middleware
        const res = { setHeader() {}, end() {} };
        _sessionMiddleware(req, res, () => {
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
function startWebSocketServer(httpServer, sessionMiddleware) {
    _sessionMiddleware = sessionMiddleware || null;
    const hasRedis = !!process.env.REDIS_URL;
    if (!hasRedis) {
        logger.info('websocket_no_redis', { reason: 'REDIS_URL not configured — WS will work without pub/sub' });
    }

    wss = new WebSocketServer({
        server: httpServer,
        path: '/ws',
        // Authenticate on upgrade — reject unauthenticated connections
        verifyClient: async ({ req }, done) => {
            try {
                const session = await parseSession(req);
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
        ws.subscribedGuilds = new Set();
        ws.sessionId = req.session?.id || null;
        ws.userId = req.session?.passport?.user?.id || null;
        ws.username = req.session?.passport?.user?.username || null;
        ws.avatar = req.session?.passport?.user?.avatar || null;
        ws.userGuilds = req.session?.passport?.user?.guilds || [];

        ws.on('pong', () => { ws.isAlive = true; });
        ws.on('error', (err) => {
            logger.warn('ws_client_error', { error: err.message });
        });

        ws.on('close', () => {
            // Clean up presence on disconnect
            for (const guildId of ws.subscribedGuilds) {
                removePresence(guildId, ws.sessionId);
                broadcastPresence(guildId);
            }
        });

        // Handle client messages
        ws.on('message', (raw) => {
            try {
                const msg = JSON.parse(raw);
                if (msg.type === 'bot:status:request') {
                    if (latestBotStatus) {
                        safeSend(ws, { type: 'bot:status', data: latestBotStatus });
                    }
                    return;
                }

                if (msg.type === 'subscribe_guild' && typeof msg.guildId === 'string' && /^\d{17,20}$/.test(msg.guildId)) {
                    // Verify user has access to the guild (MANAGE_GUILD or ADMINISTRATOR)
                    const guild = ws.userGuilds.find(g => g.id === msg.guildId);
                    if (!guild) return;
                    if (!hasManageGuild(guild.permissions)) return;
                    ws.subscribedGuilds.add(msg.guildId);
                } else if (msg.type === 'unsubscribe_guild' && typeof msg.guildId === 'string') {
                    ws.subscribedGuilds.delete(msg.guildId);
                    removePresence(msg.guildId, ws.sessionId);
                    broadcastPresence(msg.guildId);
                } else if (msg.type === 'presence' && typeof msg.guildId === 'string' && ws.subscribedGuilds.has(msg.guildId)) {
                    // User is announcing their presence on a page
                    setPresence(msg.guildId, ws.sessionId, {
                        userId: ws.userId,
                        username: ws.username,
                        avatar: ws.avatar,
                        page: typeof msg.page === 'string' ? msg.page.slice(0, 100) : 'dashboard',
                        lastSeen: Date.now(),
                    });
                    broadcastPresence(msg.guildId);
                }
            } catch (parseErr) {
                logger.warn('ws_message_parse_error', { error: parseErr.message });
            }
        });

        // Send an initial connected event
        safeSend(ws, { type: 'connected', timestamp: Date.now() });
        if (latestBotStatus) {
            safeSend(ws, { type: 'bot:status', data: latestBotStatus });
        }
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

    // Subscribe to Redis channels (only when Redis is available)
    if (hasRedis) {
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
                    latestBotStatus = tryParse(message);
                    broadcast({ type: 'bot:status', data: latestBotStatus });
                } else if (channel === 'config:invalidate') {
                    // Config invalidation — only send to clients subscribed to this guild
                    broadcastToGuild(message, { type: 'config:invalidate', guildId: message });
                }
            });
        }
    }

    // Health poll fallback — poll the bot's /health endpoint directly
    // when Redis is not available (or as a secondary source)
    const botHealthUrl = process.env.BOT_HEALTH_URL || null;
    if (botHealthUrl) {
        const HEALTH_POLL_INTERVAL = 20_000; // 20 seconds
        async function pollBotHealth() {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);
                const headers = {};
                if (process.env.BOT_HEALTH_TOKEN) {
                    headers['Authorization'] = `Bearer ${process.env.BOT_HEALTH_TOKEN}`;
                }
                const res = await fetch(botHealthUrl, {
                    signal: controller.signal,
                    headers,
                });
                clearTimeout(timeout);
                if (res.ok) {
                    const data = await res.json();
                    latestBotStatus = data;
                    broadcast({ type: 'bot:status', data: latestBotStatus });
                } else {
                    latestBotStatus = { status: 'offline', stale: true };
                    broadcast({ type: 'bot:status', data: latestBotStatus });
                }
            } catch {
                // Bot unreachable
                if (latestBotStatus?.status !== 'offline' || !latestBotStatus?.stale) {
                    latestBotStatus = { status: 'offline', stale: true };
                    broadcast({ type: 'bot:status', data: latestBotStatus });
                }
            }
        }
        pollBotHealth(); // Poll immediately
        healthPollInterval = setInterval(pollBotHealth, HEALTH_POLL_INTERVAL);
        logger.info('health_poll_started', { url: botHealthUrl, intervalMs: HEALTH_POLL_INTERVAL });
    } else if (!hasRedis) {
        logger.warn('no_bot_status_source', {
            reason: 'Neither REDIS_URL nor BOT_HEALTH_URL is configured — bot status will be unavailable',
        });
    }

    logger.info('websocket_server_started', { path: '/ws' });

    // Clean up stale presence entries every 60 seconds
    presenceCleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [guildId, sessions] of guildPresence) {
            for (const [sessionId, info] of sessions) {
                if (now - info.lastSeen > 300_000) sessions.delete(sessionId);
            }
            if (sessions.size === 0) guildPresence.delete(guildId);
        }
    }, 60_000);
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

// --- Presence management ---
function setPresence(guildId, sessionId, info) {
    if (!sessionId) return;
    if (!guildPresence.has(guildId)) {
        guildPresence.set(guildId, new Map());
    }
    guildPresence.get(guildId).set(sessionId, info);
}

function removePresence(guildId, sessionId) {
    if (!sessionId) return;
    const guild = guildPresence.get(guildId);
    if (guild) {
        guild.delete(sessionId);
        if (guild.size === 0) guildPresence.delete(guildId);
    }
}

function getPresenceList(guildId) {
    const guild = guildPresence.get(guildId);
    if (!guild) return [];
    const now = Date.now();
    const results = [];
    // Deduplicate by userId — keep the most recent entry
    const seen = new Map();
    for (const [, info] of guild) {
        if (now - info.lastSeen > 120_000) continue; // stale > 2 min
        const existing = seen.get(info.userId);
        if (!existing || info.lastSeen > existing.lastSeen) {
            seen.set(info.userId, info);
        }
    }
    for (const info of seen.values()) {
        results.push({
            userId: info.userId,
            username: info.username,
            avatar: info.avatar,
            page: info.page,
        });
    }
    return results;
}

function broadcastPresence(guildId) {
    broadcastToGuild(guildId, {
        type: 'presence:update',
        guildId,
        users: getPresenceList(guildId),
    });
}

function stopWebSocketServer() {
    if (healthPollInterval) {
        clearInterval(healthPollInterval);
        healthPollInterval = null;
    }
    if (presenceCleanupInterval) {
        clearInterval(presenceCleanupInterval);
        presenceCleanupInterval = null;
    }
    if (wss) {
        wss.close();
        wss = null;
    }
    latestBotStatus = null;
}

module.exports = { startWebSocketServer, stopWebSocketServer, broadcast };
