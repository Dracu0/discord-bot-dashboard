const os = require('os');

const startedAt = Date.now();
const counters = new Map();
const timings = new Map();

function increment(key, by = 1) {
    counters.set(key, (counters.get(key) || 0) + by);
}

function observeDuration(key, ms) {
    const current = timings.get(key) || { count: 0, totalMs: 0, minMs: Number.POSITIVE_INFINITY, maxMs: 0 };
    current.count += 1;
    current.totalMs += ms;
    current.minMs = Math.min(current.minMs, ms);
    current.maxMs = Math.max(current.maxMs, ms);
    timings.set(key, current);
}

function requestMetricsMiddleware(req, res, next) {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
        const route = req.route?.path || req.path || 'unknown';
        const keyBase = `${req.method} ${route}`;
        increment(`http.requests.total`);
        increment(`http.requests.${res.statusCode}`);
        observeDuration(`http.duration.${keyBase}`, durationMs);
    });
    next();
}

function getSnapshot(extra = {}) {
    const timingSnapshot = {};
    for (const [key, value] of timings) {
        timingSnapshot[key] = {
            count: value.count,
            avgMs: value.count ? Number((value.totalMs / value.count).toFixed(2)) : 0,
            minMs: Number.isFinite(value.minMs) ? Number(value.minMs.toFixed(2)) : 0,
            maxMs: Number(value.maxMs.toFixed(2)),
            totalMs: Number(value.totalMs.toFixed(2)),
        };
    }

    return {
        uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
        host: os.hostname(),
        counters: Object.fromEntries(counters.entries()),
        timings: timingSnapshot,
        ...extra,
    };
}

module.exports = {
    requestMetricsMiddleware,
    getSnapshot,
    increment,
    observeDuration,
};
