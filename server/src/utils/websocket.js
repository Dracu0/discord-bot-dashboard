const { WebSocketServer } = require('ws');
const logger = require('./logger');
const { getSubscriber } = require('./redis');

let wss = null;

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

    wss = new WebSocketServer({ server: httpServer, path: '/ws' });

    wss.on('connection', (ws) => {
        ws.isAlive = true;
        ws.on('pong', () => { ws.isAlive = true; });
        ws.on('error', () => {}); // prevent unhandled errors

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
                broadcast({ type: 'bot:status', data: tryParse(message) });
            } else if (channel === 'config:invalidate') {
                broadcast({ type: 'config:invalidate', guildId: message });
            }
        });
    }

    logger.info('websocket_server_started', { path: '/ws' });
}

function broadcast(payload) {
    if (!wss) return;
    const data = JSON.stringify(payload);
    for (const ws of wss.clients) {
        if (ws.readyState === 1) { // OPEN
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
