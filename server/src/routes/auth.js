const router = require('express').Router();
const crypto = require('crypto');
const passport = require('passport');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// In production (same-origin), use relative paths. In dev, use the separate frontend URL.
const DASHBOARD_URL = IS_PRODUCTION ? '' : (process.env.DASHBOARD_URL || 'http://localhost:3000');

// Check if user is authenticated (HEAD request from dashboard)
router.head('/', (req, res) => {
    if (req.isAuthenticated()) {
        req.log?.info('auth_status_ok', { userId: req.user?.id || null });
        return res.sendStatus(200);
    }
    req.log?.warn('auth_status_unauthenticated');
    return res.sendStatus(401);
});

// Start Discord OAuth2 flow
router.get('/discord', (req, res, next) => {
    req.log?.info('oauth_discord_started');
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauthState = state;
    return passport.authenticate('discord', { state })(req, res, next);
});

// Discord OAuth2 callback
router.get('/discord/callback', (req, res, next) => {
    // Validate OAuth2 state parameter to prevent CSRF
    if (!req.query.state || req.query.state !== req.session.oauthState) {
        req.log?.warn('oauth_state_mismatch');
        return res.redirect(`${DASHBOARD_URL}/signin?error=invalid_state`);
    }
    delete req.session.oauthState;

    passport.authenticate('discord', {
        failureRedirect: `${DASHBOARD_URL}/signin`,
    })(req, res, () => {
        req.log?.info('oauth_discord_callback_success', { userId: req.user?.id || null });
        res.redirect(`${DASHBOARD_URL}/admin`);
    });
});

// Sign out
router.post('/signout', (req, res) => {
    req.logout((err) => {
        if (err) {
            req.log?.error('signout_failed', { error: err, userId: req.user?.id || null });
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy(() => {
            req.log?.info('signout_success', { userId: req.user?.id || null });
            res.clearCookie('connect.sid');
            res.sendStatus(200);
        });
    });
});

module.exports = router;
