const { inspect } = require('util');

function serializeError(err) {
    if (!err) return null;
    if (err instanceof Error) {
        return {
            name: err.name,
            message: err.message,
            stack: err.stack,
        };
    }
    return { message: inspect(err, { depth: 4 }) };
}

function write(level, message, meta = {}) {
    const payload = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta,
    };

    if (payload.error) {
        payload.error = serializeError(payload.error);
    }

    const line = JSON.stringify(payload);
    if (level === 'error') {
        console.error(line);
    } else if (level === 'warn') {
        console.warn(line);
    } else {
        console.log(line);
    }
}

function createLogger(baseMeta = {}) {
    return {
        child(extraMeta = {}) {
            return createLogger({ ...baseMeta, ...extraMeta });
        },
        info(message, meta = {}) {
            write('info', message, { ...baseMeta, ...meta });
        },
        warn(message, meta = {}) {
            write('warn', message, { ...baseMeta, ...meta });
        },
        error(message, meta = {}) {
            write('error', message, { ...baseMeta, ...meta });
        },
    };
}

module.exports = createLogger({ service: 'discord-dashboard-server' });
