/**
 * Middleware: Require the user to be authenticated
 */
function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Not authenticated' });
}

/**
 * Middleware: Require the user to have MANAGE_GUILD permission in the target guild
 */
function requireGuildAccess(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const guildId = req.params.id;
    const guilds = req.user.guilds || [];

    const guild = guilds.find(g => g.id === guildId);

    if (!guild) {
        return res.status(403).json({ error: 'You are not a member of this guild' });
    }

    // Check MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8) permission
    const permissions = BigInt(guild.permissions);
    const hasManageGuild = (permissions & BigInt(0x20)) !== BigInt(0);
    const hasAdmin = (permissions & BigInt(0x8)) !== BigInt(0);

    if (!hasManageGuild && !hasAdmin) {
        return res.status(403).json({ error: 'You do not have permission to manage this guild' });
    }

    req.guild = guild;
    next();
}

module.exports = { requireAuth, requireGuildAccess };
