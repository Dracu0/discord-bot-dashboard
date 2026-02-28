import { useEffect, useRef, useCallback, useSyncExternalStore } from 'react';

const WS_RECONNECT_DELAY = 3000;
const WS_MAX_RECONNECT_DELAY = 30000;

// Singleton WebSocket manager so all hooks share one connection
let ws = null;
let listeners = new Set();
let botStatus = null;
let statusListeners = new Set();
let reconnectTimer = null;
let reconnectDelay = WS_RECONNECT_DELAY;

function getWsUrl() {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';
    if (import.meta.env.PROD) {
        return `${proto}://${window.location.host}/ws`;
    }
    // Development: dashboard server runs on port 8080
    return `${proto}://${window.location.hostname}:8080/ws`;
}

function connect() {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
        return;
    }

    try {
        ws = new WebSocket(getWsUrl());
    } catch {
        scheduleReconnect();
        return;
    }

    ws.onopen = () => {
        reconnectDelay = WS_RECONNECT_DELAY;
    };

    ws.onmessage = (event) => {
        let data;
        try { data = JSON.parse(event.data); } catch { return; }

        if (data.type === 'bot:status') {
            botStatus = data.data;
            for (const fn of statusListeners) fn();
        }

        for (const fn of listeners) fn(data);
    };

    ws.onclose = () => {
        ws = null;
        if (listeners.size > 0 || statusListeners.size > 0) {
            scheduleReconnect();
        }
    };

    ws.onerror = () => {
        // onclose will fire after onerror
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

function ensureConnected() {
    if (!ws || ws.readyState > WebSocket.OPEN) {
        connect();
    }
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
 */
export function useConfigInvalidation(guildId, onInvalidate) {
    const cbRef = useRef(onInvalidate);
    cbRef.current = onInvalidate;

    useWebSocket(useCallback((event) => {
        if (event.type === 'config:invalidate' && event.guildId === guildId) {
            cbRef.current();
        }
    }, [guildId]));
}
