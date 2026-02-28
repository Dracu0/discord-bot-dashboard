const crypto = require('crypto');

const CSRF_COOKIE = '_csrf';
const CSRF_HEADER = 'x-csrf-token';

/**
 * Generate a CSRF token and set it as an httpOnly cookie + return it in the response.
 * Clients call GET /api/csrf-token on app init, then include the token in subsequent
 * state-changing requests via the x-csrf-token header.
 */
function generateCsrfToken(req, res) {
    const token = crypto.randomBytes(32).toString('hex');

    // Store in session so we can validate later
    req.session.csrfToken = token;

    res.json({ token });
}

/**
 * Double-submit validation: the x-csrf-token header must match the session token.
 * Only applies to state-changing methods (POST, PATCH, PUT, DELETE).
 */
function csrfProtection(req, res, next) {
    // Safe methods don't need CSRF
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

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(headerToken, 'utf8'), Buffer.from(sessionToken, 'utf8'))) {
        req.log?.warn('csrf_rejected_mismatch', { path: req.originalUrl });
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    next();
}

module.exports = { csrfProtection, generateCsrfToken };
