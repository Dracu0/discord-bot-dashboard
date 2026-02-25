const router = require('express').Router();
const { requireAuth } = require('../auth/middleware');

// GET /users/@me - Get current user's account info
router.get('/@me', requireAuth, (req, res) => {
    const user = req.user;
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
router.get('/', requireAuth, (req, res) => {
    const guilds = (req.user.guilds || [])
        .filter(g => {
            const perms = BigInt(g.permissions);
            // MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8)
            return (perms & BigInt(0x20)) !== BigInt(0) || (perms & BigInt(0x8)) !== BigInt(0);
        })
        .map(g => ({
            id: g.id,
            name: g.name,
            icon: g.icon,
            owner: g.owner,
            permissions: g.permissions,
        }));

    res.json(guilds);
});

module.exports = router;
