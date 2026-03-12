import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';
import { config } from 'config/config';

const WS_RECONNECT_DELAY = 3000;
const WS_MAX_RECONNECT_DELAY = 30000;

// Singleton WebSocket manager so all hooks share one connection
let ws = null;
let listeners = new Set();
let botStatus = null;
let statusListeners = new Set();
let reconnectTimer = null;
let reconnectDelay = WS_RECONNECT_DELAY;
let lastStatusTime = 0;
let stalenessTimer = null;
let forcedReconnectTimer = null;
let forcedReconnectInFlight = false;
const STALENESS_THRESHOLD = 45_000; // 3x the bot's 15s publish interval
const STALENESS_CHECK_INTERVAL = 15_000;
let subscribedGuilds = new Set();
// Presence state
let presenceByGuild = {}; // { [guildId]: [{userId, username, avatar, page}] }
let presenceListeners = new Set();
const EMPTY_PRESENCE = []; // Stable reference to avoid useSyncExternalStore infinite loops

function getWsUrl() {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    if (import.meta.env.PROD) {
        return `${proto}://${window.location.host}/ws`;
    }
    // Development: derive from serverUrl config (handles custom ports/hosts)
    try {
        const serverOrigin = new URL(config.serverUrl, window.location.href);
        return `${proto}://${serverOrigin.host}/ws`;
    } catch {
        return `${proto}://${window.location.hostname}:8080/ws`;
    }
}

function connect() {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
        return;
    }

    try {
        ws = new WebSocket(getWsUrl());
    } catch {
        if (forcedReconnectTimer) {
            clearTimeout(forcedReconnectTimer);
            forcedReconnectTimer = null;
        }
        forcedReconnectInFlight = false;
        scheduleReconnect();
        return;
    }

    ws.onopen = () => {
        reconnectDelay = WS_RECONNECT_DELAY;
        wsSend({ type: 'bot:status:request' });
        // Re-subscribe to any guilds after reconnect
        for (const guildId of subscribedGuilds) {
            wsSend({ type: 'subscribe_guild', guildId });
        }
    };

    ws.onmessage = (event) => {
        let data;
        try { data = JSON.parse(event.data); } catch { return; }

        if (data.type === 'bot:status') {
            botStatus = data.data;
            lastStatusTime = Date.now();
            for (const fn of statusListeners) fn();
        }

        if (data.type === 'presence:update' && data.guildId) {
            presenceByGuild = { ...presenceByGuild, [data.guildId]: data.users || [] };
            for (const fn of presenceListeners) fn();
        }

        for (const fn of listeners) fn(data);
    };

    ws.onclose = () => {
        ws = null;
        if (listeners.size > 0 || statusListeners.size > 0) {
            scheduleReconnect();
        }
    };

    ws.onerror = (err) => {
        console.warn('[WS] Connection error', err);
    };
}

function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        reconnectDelay = Math.min(reconnectDelay * 1.5, WS_MAX_RECONNECT_DELAY);
        connect();
    }, reconnectDelay);
}

function forceReconnect() {
    if (forcedReconnectInFlight) return;
    forcedReconnectInFlight = true;

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    if (ws) {
        try {
            ws.close();
        } catch {
            // no-op
        }
        ws = null;
    }

    forcedReconnectTimer = setTimeout(() => {
        forcedReconnectTimer = null;
        reconnectDelay = WS_RECONNECT_DELAY;
        connect();
        forcedReconnectInFlight = false;
    }, 500);
}

function startStalenessCheck() {
    if (stalenessTimer) return;
    stalenessTimer = setInterval(() => {
        if (lastStatusTime > 0 && Date.now() - lastStatusTime > STALENESS_THRESHOLD) {
            const wasStale = botStatus?.stale;
            if (!wasStale) {
                botStatus = { status: 'offline', stale: true };
                for (const fn of statusListeners) fn();
                if (listeners.size > 0 || statusListeners.size > 0) {
                    forceReconnect();
                }
            }
        }
    }, STALENESS_CHECK_INTERVAL);
}

function stopStalenessCheck() {
    if (stalenessTimer) {
        clearInterval(stalenessTimer);
        stalenessTimer = null;
    }
    if (forcedReconnectTimer) {
        clearTimeout(forcedReconnectTimer);
        forcedReconnectTimer = null;
    }
    forcedReconnectInFlight = false;
}

function ensureConnected() {
    if (!ws || ws.readyState > WebSocket.OPEN) {
        connect();
    }
    startStalenessCheck();
}

function wsSend(payload) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
    }
}

/** Subscribe to config invalidation events for a guild (server-side filtering) */
function subscribeGuild(guildId) {
    subscribedGuilds.add(guildId);
    wsSend({ type: 'subscribe_guild', guildId });
}

function unsubscribeGuild(guildId) {
    subscribedGuilds.delete(guildId);
    wsSend({ type: 'unsubscribe_guild', guildId });
}

/**
 * Subscribe to all WebSocket events. Automatically connects/disconnects.
 * @param {(event: {type: string, [key: string]: any}) => void} callback
 */
export function useWebSocket(callback) {
    const cbRef = useRef(callback);
    cbRef.current = callback;

    useEffect(() => {
        const handler = (data) => cbRef.current(data);
        listeners.add(handler);
        ensureConnected();

        return () => {
            listeners.delete(handler);
            if (listeners.size === 0 && statusListeners.size === 0) {
                stopStalenessCheck();
                if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
                if (ws) { ws.close(); ws = null; }
            }
        };
    }, []);
}

// External store for bot status
const subscribeBotStatus = (onStoreChange) => {
    statusListeners.add(onStoreChange);
    ensureConnected();
    return () => {
        statusListeners.delete(onStoreChange);
        if (listeners.size === 0 && statusListeners.size === 0) {
            stopStalenessCheck();
            if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
            if (ws) { ws.close(); ws = null; }
        }
    };
};
const getSnapshot = () => botStatus;

/**
 * Returns the latest bot status from WebSocket, or null if not yet received.
 */
export function useBotStatus() {
    return useSyncExternalStore(subscribeBotStatus, getSnapshot, getSnapshot);
}

/**
 * Subscribe to config invalidation events for a specific guild.
 * Calls `onInvalidate` when the bot's config for `guildId` changes.
 * Also subscribes on the server side so only relevant events are broadcast.
 */
export function useConfigInvalidation(guildId, onInvalidate) {
    const cbRef = useRef(onInvalidate);
    cbRef.current = onInvalidate;

    useEffect(() => {
        if (!guildId) return;
        subscribeGuild(guildId);
        return () => unsubscribeGuild(guildId);
    }, [guildId]);

    useWebSocket(useCallback((event) => {
        if (event.type === 'config:invalidate' && event.guildId === guildId) {
            cbRef.current();
        }
    }, [guildId]));
}

// --- Presence ---

const PRESENCE_INTERVAL = 30_000; // Send presence heartbeat every 30s

/**
 * Announce presence on a page and subscribe to presence updates for a guild.
 * Returns the list of active users for that guild.
 *
 * @param {string} guildId
 * @param {string} page - current page/route name
 * @returns {Array<{userId: string, username: string, avatar: string|null, page: string}>}
 */
export function usePresence(guildId, page) {
    // Send presence announcements
    useEffect(() => {
        if (!guildId) return;
        const send = () => wsSend({ type: 'presence', guildId, page });
        send(); // send immediately
        const interval = setInterval(send, PRESENCE_INTERVAL);
        return () => clearInterval(interval);
    }, [guildId, page]);

    // Subscribe to presence updates via external store
    const subscribe = useCallback((onStoreChange) => {
        presenceListeners.add(onStoreChange);
        ensureConnected();
        return () => { presenceListeners.delete(onStoreChange); };
    }, []);

    const getPresenceSnapshot = useCallback(
        () => presenceByGuild[guildId] || EMPTY_PRESENCE,
        [guildId]
    );

    return useSyncExternalStore(subscribe, getPresenceSnapshot, getPresenceSnapshot);
}
