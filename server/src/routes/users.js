const router = require('express').Router();
const { requireAuth } = require('../auth/middleware');
const { fetchBotGuildIds } = require('../utils/discord');

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

// GET /guilds - Get guilds the user is in (with manage permissions)
router.get('/', requireAuth, async (req, res) => {
    try {
        const manageable = (req.user.guilds || [])
            .filter(g => {
                const perms = BigInt(g.permissions);
                // MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8)
                return (perms & BigInt(0x20)) !== BigInt(0) || (perms & BigInt(0x8)) !== BigInt(0);
            });

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
