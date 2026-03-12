class ApiError extends Error {
    constructor(status, code, message, details) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

function toErrorPayload(err, fallbackMessage = 'Internal server error') {
    const status = Number.isInteger(err?.status) ? err.status : 500;
    const code = typeof err?.code === 'string' && err.code ? err.code : (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
    const message = typeof err?.message === 'string' && err.message ? err.message : fallbackMessage;
    const payload = {
        status: 'error',
        code,
        message,
    };

    if (err?.details !== undefined) {
        payload.details = err.details;
    }

    return { status, payload };
}

function sendApiError(res, err, fallbackMessage) {
    const { status, payload } = toErrorPayload(err, fallbackMessage);
    return res.status(status).json(payload);
}

function badRequest(message, details) {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
}

function forbidden(message = 'Forbidden', details) {
    return new ApiError(403, 'FORBIDDEN', message, details);
}

function notFound(message = 'Not found', details) {
    return new ApiError(404, 'NOT_FOUND', message, details);
}

function internalError(message = 'Internal server error', details) {
    return new ApiError(500, 'INTERNAL_ERROR', message, details);
}

module.exports = {
    ApiError,
    toErrorPayload,
    sendApiError,
    badRequest,
    forbidden,
    notFound,
    internalError,
};
