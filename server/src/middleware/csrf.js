const crypto = require('crypto');

const CSRF_HEADER = 'x-csrf-token';

/**
 * Generate a CSRF token and return it in the response.
 * Clients call GET /api/csrf-token on app init, then include the token in subsequent
 * state-changing requests via the x-csrf-token header.
 */
function generateCsrfToken(req, res) {
    const token = crypto.randomBytes(32).toString('hex');
    req.session.csrfToken = token;
    req.session.save((err) => {
        if (err) {
            req.log?.error('csrf_session_save_failed', { error: err.message });
            return res.status(500).json({ error: 'Failed to generate CSRF token' });
        }
        res.json({ token });
    });
}

/**
 * Double-submit validation: the x-csrf-token header must match the session token.
 * Only applies to state-changing methods (POST, PATCH, PUT, DELETE).
 * The token is stable for the session lifetime — no per-request rotation.
 */
function csrfProtection(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const headerToken = req.headers[CSRF_HEADER];
    const sessionToken = req.session?.csrfToken;

    if (!headerToken || !sessionToken) {
        req.log?.warn('csrf_rejected_missing_token', {
            path: req.originalUrl,
            hasHeader: !!headerToken,
            hasSession: !!sessionToken,
        });
        return res.status(403).json({ error: 'Missing CSRF token' });
    }

    // Safe buffer comparison: check length first to prevent timingSafeEqual crash
    const headerBuf = Buffer.from(headerToken, 'utf8');
    const sessionBuf = Buffer.from(sessionToken, 'utf8');

    if (headerBuf.length !== sessionBuf.length || !crypto.timingSafeEqual(headerBuf, sessionBuf)) {
        req.log?.warn('csrf_rejected_mismatch', { path: req.originalUrl });
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    next();
}

module.exports = { csrfProtection, generateCsrfToken };
