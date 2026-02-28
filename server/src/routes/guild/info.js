const router = require('express').Router({ mergeParams: true });
const GuildConfiguration = require('../../models/GuildConfiguration');
const Level = require('../../models/Level');
const ModLog = require('../../models/ModLog');
const Suggestion = require('../../models/Suggestion');
const AuditLog = require('../../models/AuditLog');
const { fetchGuild, fetchGuildChannels, fetchGuildRoles } = require('../../utils/discord');

// GET /guild/:id
router.get('/', async (req, res) => {
    try {
        const guild = await fetchGuild(req.params.id);
        res.json({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            owner_id: guild.owner_id,
            member_count: guild.approximate_member_count ?? 0,
            presence_count: guild.approximate_presence_count ?? 0,
        });
    } catch (err) {
        req.log?.error('guild_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch guild info' });
    }
});

// GET /guild/:id/detail
router.get('/detail', async (req, res) => {
    try {
        const guildId = req.params.id;
        const [guild, config] = await Promise.all([
            fetchGuild(guildId),
            GuildConfiguration.findOne({ guildId }),
        ]);

        const totalMembers = guild.approximate_member_count || 0;
        const onlineMembers = guild.approximate_presence_count || 0;

        res.json({
            name: guild.name,
            icon: guild.icon,
            members: totalMembers,
            online: onlineMembers,
            mcServers: config?.mcServers?.length || 0,
            suggestionsEnabled: (config?.suggestionChannelIds?.length || 0) > 0,
            xpEnabled: !(config?.xpDisableLevelUpMessages ?? false),
            welcomeEnabled: !!(config?.welcomeChannelId),
            modLogEnabled: !!(config?.modLogChannelId),
        });
    } catch (err) {
        req.log?.error('guild_detail_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch server details' });
    }
});

// GET /guild/:id/detail/advanced
router.get('/detail/advanced', async (req, res) => {
    try {
        const guildId = req.params.id;

        const [
            totalLevels,
            topUsers,
            totalSuggestions,
            pendingSuggestions,
            recentModLogs,
            totalModLogs,
        ] = await Promise.all([
            Level.countDocuments({ guildId }),
            Level.find({ guildId }).sort({ Level: -1, XP: -1 }).limit(10).lean(),
            Suggestion.countDocuments({ guildId }),
            Suggestion.countDocuments({ guildId, status: 'pending' }),
            ModLog.find({ guildId }).sort({ createdAt: -1 }).limit(10).lean(),
            ModLog.countDocuments({ guildId }),
        ]);

        res.json({
            xp: {
                totalTrackedUsers: totalLevels,
                leaderboard: topUsers.map((u, i) => ({
                    rank: i + 1,
                    userId: u.userId,
                    userName: u.userName || 'Unknown',
                    level: u.Level,
                    xp: u.XP,
                })),
            },
            suggestions: {
                total: totalSuggestions,
                pending: pendingSuggestions,
            },
            moderation: {
                totalActions: totalModLogs,
                recentActions: recentModLogs.map(log => ({
                    action: log.action,
                    targetId: log.targetId,
                    moderatorId: log.moderatorId,
                    reason: log.reason,
                    createdAt: log.createdAt,
                })),
            },
        });
    } catch (err) {
        req.log?.error('guild_advanced_detail_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch advanced details' });
    }
});

// GET /guild/:id/notification
router.get('/notification', async (req, res) => {
    try {
        const guildId = req.params.id;
        const [pendingSuggestions, recentMod] = await Promise.all([
            Suggestion.countDocuments({ guildId, status: 'pending' }),
            ModLog.find({ guildId }).sort({ createdAt: -1 }).limit(5).lean(),
        ]);

        const notifications = [];

        if (pendingSuggestions > 0) {
            notifications.push({
                type: 'info',
                message: `${pendingSuggestions} pending suggestion(s) await review`,
            });
        }

        recentMod.forEach(log => {
            notifications.push({
                type: 'moderation',
                message: `${log.action}: user ${log.targetId} by ${log.moderatorId}`,
                time: log.createdAt,
            });
        });

        res.json(notifications);
    } catch (err) {
        req.log?.error('guild_notifications_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// GET /guild/:id/leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const guildId = req.params.id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            Level.find({ guildId })
                .sort({ Level: -1, XP: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Level.countDocuments({ guildId }),
        ]);

        res.json({
            users: users.map((u, i) => ({
                rank: skip + i + 1,
                userId: u.userId,
                userName: u.userName || 'Unknown',
                level: u.Level,
                xp: u.XP,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        req.log?.error('guild_leaderboard_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

const Ticket = require('../../models/Ticket');

// GET /guild/:id/analytics
router.get('/analytics', async (req, res) => {
    try {
        const guildId = req.params.id;
        const days = Math.min(90, Math.max(7, parseInt(req.query.days) || 30));
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const [
            modActionsByDay,
            modActionsByType,
            suggestionsByStatus,
            xpDistribution,
            ticketStats,
            auditByCategory,
        ] = await Promise.all([
            // Mod actions grouped by day
            ModLog.aggregate([
                { $match: { guildId, createdAt: { $gte: since } } },
                { $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                }},
                { $sort: { _id: 1 } },
            ]),
            // Mod actions grouped by type
            ModLog.aggregate([
                { $match: { guildId, createdAt: { $gte: since } } },
                { $group: { _id: '$action', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
            // Suggestions by status
            Suggestion.aggregate([
                { $match: { guildId } },
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            // XP level distribution (buckets)
            Level.aggregate([
                { $match: { guildId } },
                { $bucket: {
                    groupBy: '$Level',
                    boundaries: [0, 5, 10, 20, 30, 50, 100],
                    default: '100+',
                    output: { count: { $sum: 1 } },
                }},
            ]),
            // Ticket stats
            Promise.all([
                Ticket.countDocuments({ guildId, status: 'open' }),
                Ticket.countDocuments({ guildId, status: 'closed', closedAt: { $gte: since } }),
                Ticket.aggregate([
                    { $match: { guildId, status: 'closed', closedAt: { $ne: null } } },
                    { $project: { resolutionTime: { $subtract: ['$closedAt', '$createdAt'] } } },
                    { $group: { _id: null, avg: { $avg: '$resolutionTime' } } },
                ]),
            ]),
            // Audit log by category
            AuditLog.aggregate([
                { $match: { guildId, createdAt: { $gte: since } } },
                { $group: { _id: '$category', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
        ]);

        res.json({
            period: { days, since: since.toISOString() },
            moderation: {
                byDay: modActionsByDay.map(d => ({ date: d._id, count: d.count })),
                byType: modActionsByType.map(d => ({ action: d._id, count: d.count })),
            },
            suggestions: {
                byStatus: suggestionsByStatus.map(d => ({ status: d._id, count: d.count })),
            },
            xp: {
                levelDistribution: xpDistribution.map(d => ({
                    range: d._id === '100+' ? '100+' : `${d._id}-${d._id < 100 ? [5, 10, 20, 30, 50, 100][[0, 5, 10, 20, 30, 50].indexOf(d._id)] - 1 : ''}`,
                    count: d.count,
                })),
            },
            tickets: {
                open: ticketStats[0],
                closedRecently: ticketStats[1],
                avgResolutionMs: ticketStats[2][0]?.avg || null,
            },
            audit: {
                byCategory: auditByCategory.map(d => ({ category: d._id, count: d.count })),
            },
        });
    } catch (err) {
        req.log?.error('guild_analytics_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// GET /guild/:id/audit-log
router.get('/audit-log', async (req, res) => {
    try {
        const guildId = req.params.id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const filter = { guildId };

        if (req.query.category) {
            filter.category = String(req.query.category);
        }
        if (req.query.action) {
            filter.action = String(req.query.action);
        }
        if (req.query.actorId) {
            filter.actorId = String(req.query.actorId);
        }

        const [entries, total] = await Promise.all([
            AuditLog.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            AuditLog.countDocuments(filter),
        ]);

        res.json({
            entries: entries.map(e => ({
                id: e._id,
                actorId: e.actorId,
                actorTag: e.actorTag,
                source: e.source,
                category: e.category,
                action: e.action,
                target: e.target,
                before: e.before,
                after: e.after,
                createdAt: e.createdAt,
            })),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        req.log?.error('guild_audit_log_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch audit log' });
    }
});

module.exports = router;
