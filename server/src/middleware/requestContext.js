const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

function requestContext(req, res, next) {
    const requestId = req.get('x-request-id') || randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    const start = Date.now();
    req.log = logger.child({
        requestId,
        method: req.method,
        path: req.originalUrl,
        userId: req.user?.id || null,
    });

    res.on('finish', () => {
        req.log.info('request_completed', {
            statusCode: res.statusCode,
            durationMs: Date.now() - start,
        });
    });

    next();
}

module.exports = { requestContext };
