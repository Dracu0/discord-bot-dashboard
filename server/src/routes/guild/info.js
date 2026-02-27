const router = require('express').Router({ mergeParams: true });
const GuildConfiguration = require('../../models/GuildConfiguration');
const Level = require('../../models/Level');
const ModLog = require('../../models/ModLog');
const Suggestion = require('../../models/Suggestion');
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
            member_count: guild.approximate_member_count,
            presence_count: guild.approximate_presence_count,
        });
    } catch (err) {
        console.error('Failed to fetch guild:', err);
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
        console.error('Failed to get server detail:', err);
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
        console.error('Failed to get advanced details:', err);
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
        console.error('Failed to get notifications:', err);
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
        console.error('Failed to get leaderboard:', err);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

module.exports = router;
