/**
 * Middleware: Require the user to be authenticated
 */
function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.log?.warn('auth_required_rejected', { path: req.originalUrl });
    return res.status(401).json({ error: 'Not authenticated' });
}

/**
 * Middleware: Require the user to have MANAGE_GUILD permission in the target guild
 */
function requireGuildAccess(req, res, next) {
    if (!req.isAuthenticated()) {
        req.log?.warn('guild_access_rejected_unauthenticated', { path: req.originalUrl });
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const guildId = req.params.id;
    if (!/^\d{17,20}$/.test(guildId)) {
        req.log?.warn('guild_access_rejected_invalid_guild_id', { guildId });
        return res.status(400).json({ error: 'Invalid guild ID format' });
    }
    const guilds = req.user.guilds || [];

    const guild = guilds.find(g => g.id === guildId);

    if (!guild) {
        req.log?.warn('guild_access_rejected_not_member', { guildId, userId: req.user?.id || null });
        return res.status(403).json({ error: 'You are not a member of this guild' });
    }

    // Check MANAGE_GUILD (0x20) or ADMINISTRATOR (0x8) permission
    const permissions = BigInt(guild.permissions);
    const hasManageGuild = (permissions & BigInt(0x20)) !== BigInt(0);
    const hasAdmin = (permissions & BigInt(0x8)) !== BigInt(0);

    if (!hasManageGuild && !hasAdmin) {
        req.log?.warn('guild_access_rejected_missing_permissions', {
            guildId,
            userId: req.user?.id || null,
            permissions: guild.permissions,
        });
        return res.status(403).json({ error: 'You do not have permission to manage this guild' });
    }

    req.guild = guild;
    req.log?.info('guild_access_granted', { guildId, userId: req.user?.id || null });
    next();
}

module.exports = { requireAuth, requireGuildAccess };
