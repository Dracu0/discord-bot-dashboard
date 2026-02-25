const router = require('express').Router();
const passport = require('passport');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
// In production (same-origin), use relative paths. In dev, use the separate frontend URL.
const DASHBOARD_URL = IS_PRODUCTION ? '' : (process.env.DASHBOARD_URL || 'http://localhost:3000');

// Check if user is authenticated (HEAD request from dashboard)
router.head('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.sendStatus(200);
    }
    return res.sendStatus(401);
});

// Start Discord OAuth2 flow
router.get('/discord', passport.authenticate('discord'));

// Discord OAuth2 callback
router.get('/discord/callback',
    passport.authenticate('discord', {
        failureRedirect: `${DASHBOARD_URL}/signin`,
    }),
    (req, res) => {
        // Successful auth, redirect to dashboard
        res.redirect(`${DASHBOARD_URL}/admin`);
    }
);

// Sign out
router.post('/signout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.sendStatus(200);
        });
    });
});

module.exports = router;
