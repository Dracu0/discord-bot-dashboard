const router = require('express').Router();
const { requireAuth } = require('../auth/middleware');
const { fetchGuild } = require('../utils/discord');

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
router.get('/', requireAuth, async (req, res) => {
    const manageable = (req.user.guilds || [])
        .filter(g => {
            const perms = BigInt(g.permissions);
            // MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8)
            return (perms & BigInt(0x20)) !== BigInt(0) || (perms & BigInt(0x8)) !== BigInt(0);
        });

    // Check which guilds the bot is actually in
    const guilds = await Promise.all(
        manageable.map(async (g) => {
            let exist = false;
            try {
                await fetchGuild(g.id);
                exist = true;
            } catch {
                // Bot is not in this guild
            }
            return {
                id: g.id,
                name: g.name,
                icon: g.icon,
                owner: g.owner,
                permissions: g.permissions,
                exist,
            };
        })
    );

    res.json(guilds);
});

module.exports = router;
