const { hasManageGuild } = require('../utils/permissions');

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

const GUILDS_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Refresh the user's guild list from Discord API if stale.
 * This ensures that permission changes and guild removals are reflected
 * within GUILDS_REFRESH_INTERVAL rather than lasting the full session TTL.
 */
async function refreshUserGuilds(req) {
    const user = req.session?.passport?.user;
    if (!user?._accessToken) return;

    const now = Date.now();
    if (user._guildsRefreshedAt && now - user._guildsRefreshedAt < GUILDS_REFRESH_INTERVAL) return;

    try {
        const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
            headers: { Authorization: `Bearer ${user._accessToken}` },
        });
        if (!response.ok) return; // Token may have expired — skip refresh silently
        const guilds = await response.json();
        user.guilds = guilds;
        user._guildsRefreshedAt = now;
        req.session.save((err) => {
            if (err) req.log?.warn('session_save_failed', { error: err.message });
        });
    } catch {
        // Network error — skip refresh, use cached guilds
    }
}

/**
 * Middleware: Require the user to have MANAGE_GUILD permission in the target guild
 */
async function requireGuildAccess(req, res, next) {
    if (!req.isAuthenticated()) {
        req.log?.warn('guild_access_rejected_unauthenticated', { path: req.originalUrl });
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const guildId = req.params.id;
    if (!/^\d{17,20}$/.test(guildId)) {
        req.log?.warn('guild_access_rejected_invalid_guild_id', { guildId });
        return res.status(400).json({ error: 'Invalid guild ID format' });
    }

    // Refresh guilds if stale
    await refreshUserGuilds(req);

    const guilds = req.user.guilds || [];

    const guild = guilds.find(g => g.id === guildId);

    if (!guild) {
        req.log?.warn('guild_access_rejected_not_member', { guildId, userId: req.user?.id || null });
        return res.status(403).json({ error: 'You are not a member of this guild' });
    }

    if (!hasManageGuild(guild.permissions)) {
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
