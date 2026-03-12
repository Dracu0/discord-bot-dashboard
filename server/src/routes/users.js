const router = require('express').Router();
const { requireAuth } = require('../auth/middleware');
const { fetchBotGuildIds } = require('../utils/discord');
const { hasManageGuild } = require('../utils/permissions');
const UserPreference = require('../models/UserPreference');

const ALLOWED_PREF_KEYS = ['colorScheme', 'accentColor', 'sidebarCollapsed'];
const ALLOWED_COLOR_SCHEMES = ['light', 'dark', 'auto', 'system'];
const ALLOWED_ACCENTS = ['brand', 'blue', 'teal', 'green', 'orange', 'pink'];

// GET /users/@me - Get current user's account info
router.get('/@me', requireAuth, (req, res) => {
    const user = req.user;
    req.log?.info('users_me_fetched', { userId: user?.id || null });
    res.json({
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar,
        banner: user.banner || null,
        accent_color: user.accent_color || null,
    });
});

// GET /users/preferences - Get user dashboard preferences
router.get('/preferences', requireAuth, async (req, res) => {
    try {
        const prefs = await UserPreference.findOne({ userId: req.user.id }).lean();
        if (!prefs) {
            return res.json({ colorScheme: 'system', accentColor: 'brand', language: 'en', sidebarCollapsed: false });
        }
        res.json({
            colorScheme: prefs.colorScheme,
            accentColor: prefs.accentColor,
            language: 'en',
            sidebarCollapsed: prefs.sidebarCollapsed,
        });
    } catch (err) {
        req.log?.error('preferences_fetch_failed', { userId: req.user?.id, error: err });
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
});

// PATCH /users/preferences - Update user dashboard preferences
router.patch('/preferences', requireAuth, async (req, res) => {
    try {
        const updates = {};
        for (const key of ALLOWED_PREF_KEYS) {
            if (key in req.body) {
                updates[key] = req.body[key];
            }
        }

        // Validate values
        if (updates.colorScheme && !ALLOWED_COLOR_SCHEMES.includes(updates.colorScheme)) {
            return res.status(400).json({ error: 'Invalid colorScheme' });
        }
        if (updates.accentColor && !ALLOWED_ACCENTS.includes(updates.accentColor)) {
            return res.status(400).json({ error: 'Invalid accentColor' });
        }
        if ('sidebarCollapsed' in updates && typeof updates.sidebarCollapsed !== 'boolean') {
            return res.status(400).json({ error: 'Invalid sidebarCollapsed' });
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields to update' });
        }

        const prefs = await UserPreference.findOneAndUpdate(
            { userId: req.user.id },
            { $set: updates },
            { upsert: true, new: true, runValidators: true }
        ).lean();

        req.log?.info('preferences_updated', { userId: req.user.id, fields: Object.keys(updates) });

        res.json({
            colorScheme: prefs.colorScheme,
            accentColor: prefs.accentColor,
            language: 'en',
            sidebarCollapsed: prefs.sidebarCollapsed,
        });
    } catch (err) {
        req.log?.error('preferences_update_failed', { userId: req.user?.id, error: err });
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

// GET /guilds - Get guilds the user is in (with manage permissions)
router.get('/', requireAuth, async (req, res) => {
    try {
        const manageable = (req.user.guilds || [])
            .filter(g => hasManageGuild(g.permissions));

        // Fetch all bot guild IDs in one batch instead of N individual API calls
        const botGuildIds = await fetchBotGuildIds();
        const guilds = manageable.map((g) => ({
            id: g.id,
            name: g.name,
            icon: g.icon,
            owner: g.owner,
            permissions: g.permissions,
            exist: botGuildIds.has(g.id),
        }));

        req.log?.info('users_manageable_guilds_fetched', {
            userId: req.user?.id || null,
            manageableCount: manageable.length,
            visibleCount: guilds.length,
        });

        res.json(guilds);
    } catch (err) {
        req.log?.error('users_manageable_guilds_fetch_failed', { userId: req.user?.id || null, error: err });
        res.status(500).json({ error: 'Failed to fetch guilds' });
    }
});

module.exports = router;
