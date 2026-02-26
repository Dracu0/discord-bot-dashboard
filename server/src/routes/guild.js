const router = require('express').Router();
const { randomUUID } = require('crypto');
const { requireGuildAccess } = require('../auth/middleware');
const GuildConfiguration = require('../models/GuildConfiguration');
const Level = require('../models/Level');
const ModLog = require('../models/ModLog');
const Suggestion = require('../models/Suggestion');
const { fetchGuild, fetchGuildChannels, fetchGuildRoles } = require('../utils/discord');

// Validation helpers
const VALID_SUGGESTION_STATUSES = ['pending', 'approved', 'rejected', 'in-progress'];
function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}
function isObject(val) {
    return val != null && typeof val === 'object' && !Array.isArray(val);
}

// All guild routes require access
router.use('/:id', requireGuildAccess);

// ============================================================
// GUILD INFO
// ============================================================

// GET /guild/:id - Guild basic info (from Discord API)
router.get('/:id', async (req, res) => {
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

// GET /guild/:id/detail - Server details for dashboard
router.get('/:id/detail', async (req, res) => {
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

// GET /guild/:id/detail/advanced - Advanced statistics
router.get('/:id/detail/advanced', async (req, res) => {
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

// GET /guild/:id/notification - Get guild notifications
router.get('/:id/notification', async (req, res) => {
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

// ============================================================
// FEATURES
// ============================================================

// Feature ID to config field mapping
const FEATURE_FIELDS = {
    welcome: {
        enableCheck: (c) => !!c.welcomeChannelId,
        fields: ['welcomeChannelId', 'welcomeMessage', 'goodbyeMessage', 'welcomeEmbed', 'welcomeColor', 'goodbyeColor', 'autoRoleIds'],
    },
    xp: {
        enableCheck: (c) => !c.xpDisableLevelUpMessages,
        fields: ['xpIgnoredChannelIds', 'xpLevelUpChannelId', 'xpDisableLevelUpMessages', 'levelRoles', 'xpChannelMultipliers', 'xpRoleMultipliers'],
    },
    suggestions: {
        enableCheck: (c) => c.suggestionChannelIds.length > 0,
        fields: ['suggestionChannelIds', 'suggestionCooldownMs'],
    },
    minecraft: {
        enableCheck: (c) => c.pingEnabled,
        fields: ['pingEnabled', 'mcServers'],
    },
    modlog: {
        enableCheck: (c) => !!c.modLogChannelId,
        fields: ['modLogChannelId', 'warnThresholds'],
    },
    reaction_roles: {
        enableCheck: (c) => (c.reactionRoles || []).length > 0,
        fields: ['reactionRoles'],
    },
};

// GET /guild/:id/features - List features and enabled status
router.get('/:id/features', async (req, res) => {
    try {
        const guildId = req.params.id;
        let config = await GuildConfiguration.findOne({ guildId });

        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        const enabled = Object.entries(FEATURE_FIELDS)
            .filter(([, def]) => def.enableCheck(config))
            .map(([id]) => id);

        // Fetch channels and roles for the options UI
        const [channels, roles] = await Promise.all([
            fetchGuildChannels(guildId).catch(() => []),
            fetchGuildRoles(guildId).catch(() => []),
        ]);

        res.json({
            enabled,
            data: {
                channels: channels
                    .filter(ch => ch.type === 0 || ch.type === 5) // text & announcement
                    .map(ch => ({ id: ch.id, name: ch.name, type: ch.type })),
                roles: roles
                    .filter(r => !r.managed && r.name !== '@everyone')
                    .map(r => ({ id: r.id, name: r.name, color: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : null })),
            },
        });
    } catch (err) {
        console.error('Failed to get features:', err);
        res.status(500).json({ error: 'Failed to fetch features' });
    }
});

// PATCH /guild/:id/feature/:featureId/enabled - Toggle feature
router.patch('/:id/feature/:featureId/enabled', async (req, res) => {
    try {
        const { id: guildId, featureId } = req.params;

        if (!isObject(req.body) || typeof req.body.enabled !== 'boolean') {
            return res.status(400).json({ error: 'Body must be { enabled: boolean }' });
        }
        const { enabled } = req.body;

        const featureDef = FEATURE_FIELDS[featureId];
        if (!featureDef) {
            return res.status(404).json({ error: 'Unknown feature' });
        }

        let config = await GuildConfiguration.findOne({ guildId });
        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        // Apply enable/disable logic per feature
        switch (featureId) {
            case 'welcome':
                if (!enabled) config.welcomeChannelId = '';
                break;
            case 'xp':
                config.xpDisableLevelUpMessages = !enabled;
                break;
            case 'suggestions':
                if (!enabled) config.suggestionChannelIds = [];
                break;
            case 'minecraft':
                config.pingEnabled = enabled;
                break;
            case 'modlog':
                if (!enabled) config.modLogChannelId = '';
                break;
            case 'reaction_roles':
                if (!enabled) config.reactionRoles = [];
                break;
            default:
                break;
        }

        await config.save();
        res.sendStatus(200);
    } catch (err) {
        console.error('Failed to toggle feature:', err);
        res.status(500).json({ error: 'Failed to toggle feature' });
    }
});

// GET /guild/:id/feature/:featureId - Get feature detail/values
router.get('/:id/feature/:featureId', async (req, res) => {
    try {
        const { id: guildId, featureId } = req.params;

        const featureDef = FEATURE_FIELDS[featureId];
        if (!featureDef) {
            return res.status(404).json({ error: 'Unknown feature' });
        }

        let config = await GuildConfiguration.findOne({ guildId });
        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        // Build values object from the feature's fields
        const values = {};
        for (const field of featureDef.fields) {
            values[field] = config[field];
        }

        res.json({ values });
    } catch (err) {
        console.error('Failed to get feature detail:', err);
        res.status(500).json({ error: 'Failed to fetch feature detail' });
    }
});

// PATCH /guild/:id/feature/:featureId - Update feature options
router.patch('/:id/feature/:featureId', async (req, res) => {
    try {
        const { id: guildId, featureId } = req.params;
        const updates = req.body;

        if (!isObject(updates)) {
            return res.status(400).json({ error: 'Body must be a JSON object' });
        }

        const featureDef = FEATURE_FIELDS[featureId];
        if (!featureDef) {
            return res.status(404).json({ error: 'Unknown feature' });
        }

        let config = await GuildConfiguration.findOne({ guildId });
        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        // Only allow updating fields belonging to this feature
        const allowedFields = new Set(featureDef.fields);
        for (const [key, value] of Object.entries(updates)) {
            if (!allowedFields.has(key)) continue;

            // Validate string field lengths
            if (typeof value === 'string' && value.length > 2000) {
                return res.status(400).json({ error: `${key} exceeds maximum length (2000 chars)` });
            }

            // Convert levelRoles from [[level, roleId], ...] to [{level, roleId}, ...]
            if (key === 'levelRoles' && Array.isArray(value)) {
                if (value.length > 50) {
                    return res.status(400).json({ error: 'Maximum 50 level roles' });
                }
                config[key] = value.map(item => {
                    if (Array.isArray(item)) {
                        const level = Number(item[0]);
                        const roleId = String(item[1]);
                        if (!Number.isFinite(level) || level < 0 || !/^\d{17,20}$/.test(roleId)) {
                            return null;
                        }
                        return { level, roleId };
                    }
                    if (isObject(item) && Number.isFinite(Number(item.level)) && /^\d{17,20}$/.test(String(item.roleId))) {
                        return { level: Number(item.level), roleId: String(item.roleId) };
                    }
                    return null;
                }).filter(Boolean);
            }
            // Convert XP multipliers from [[targetId, multiplier], ...] to [{targetId, multiplier}, ...]
            else if ((key === 'xpChannelMultipliers' || key === 'xpRoleMultipliers') && Array.isArray(value)) {
                const limit = 25;
                if (value.length > limit) {
                    return res.status(400).json({ error: `Maximum ${limit} ${key}` });
                }
                config[key] = value.map(item => {
                    if (Array.isArray(item)) {
                        const targetId = String(item[0]);
                        const multiplier = Number(item[1]);
                        if (!/^\d{17,20}$/.test(targetId) || !Number.isFinite(multiplier) || multiplier < 0 || multiplier > 10) {
                            return null;
                        }
                        return { targetId, multiplier };
                    }
                    if (isObject(item) && /^\d{17,20}$/.test(String(item.targetId))) {
                        const multiplier = Number(item.multiplier);
                        if (!Number.isFinite(multiplier) || multiplier < 0 || multiplier > 10) return null;
                        return { targetId: String(item.targetId), multiplier };
                    }
                    return null;
                }).filter(Boolean);
            }
            // Convert warnThresholds from [[count, "action:duration"], ...] to [{count, action, duration}, ...]
            else if (key === 'warnThresholds' && Array.isArray(value)) {
                if (value.length > 10) {
                    return res.status(400).json({ error: 'Maximum 10 warn thresholds' });
                }
                const VALID_ACTIONS = ['timeout', 'kick', 'ban'];
                config[key] = value.map(item => {
                    let count, actionStr;
                    if (Array.isArray(item)) {
                        count = Number(item[0]);
                        actionStr = String(item[1] || '');
                    } else if (isObject(item)) {
                        count = Number(item.count);
                        actionStr = item.duration ? `${item.action}:${item.duration}` : String(item.action || '');
                    } else {
                        return null;
                    }
                    if (!Number.isFinite(count) || count < 1) return null;
                    const [action, durationStr] = actionStr.split(':');
                    if (!VALID_ACTIONS.includes(action)) return null;
                    const duration = durationStr ? Number(durationStr) : 0;
                    if (!Number.isFinite(duration) || duration < 0) return null;
                    return { count: Math.floor(count), action, duration };
                }).filter(Boolean);
            }
            // Convert mcServers from ["name:ip", ...] to [{name, ip}, ...] preserving existing sub-fields
            else if (key === 'mcServers' && Array.isArray(value)) {
                if (value.length > 10) {
                    return res.status(400).json({ error: 'Maximum 10 Minecraft servers' });
                }
                const existing = config.mcServers || [];
                config[key] = value.map((item, i) => {
                    if (typeof item === 'string') {
                        const [name, ...rest] = item.split(':');
                        const ip = rest.join(':');
                        // Preserve existing sub-fields if the server existed before
                        const prev = existing.find(s => s.name === name && s.ip === ip) || existing[i] || {};
                        return {
                            name: name || '',
                            ip: ip || '',
                            alertChannelId: prev.alertChannelId || '',
                            alertRoleId: prev.alertRoleId || '',
                            alertPingMode: prev.alertPingMode || 'both',
                            liveEmbedChannelId: prev.liveEmbedChannelId || '',
                            liveEmbedMode: prev.liveEmbedMode || 'edit',
                        };
                    }
                    return item;
                });
            }
            // Convert hex color strings to numbers for DB storage
            else if ((key === 'welcomeColor' || key === 'goodbyeColor') && typeof value === 'string') {
                if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
                    return res.status(400).json({ error: `${key} must be a hex color string (#RRGGBB)` });
                }
                config[key] = parseInt(value.replace('#', ''), 16);
            }
            // Array-of-string fields: validate each element is a snowflake
            else if (Array.isArray(value) && ['suggestionChannelIds', 'xpIgnoredChannelIds', 'autoRoleIds'].includes(key)) {
                config[key] = value.filter(v => typeof v === 'string' && /^\d{17,20}$/.test(v));
            }
            // Boolean fields
            else if (typeof value === 'boolean' && ['pingEnabled', 'welcomeEmbed', 'xpDisableLevelUpMessages'].includes(key)) {
                config[key] = value;
            }
            // String fields (channel IDs, messages)
            else if (typeof value === 'string') {
                config[key] = value;
            }
            // Number fields
            else if (typeof value === 'number' && Number.isFinite(value)) {
                config[key] = value;
            }
        }

        // Handle per-server Minecraft sub-fields (mcServer_N_fieldName)
        if (featureId === 'minecraft' && config.mcServers) {
            const MC_SUB_FIELDS = new Set([
                'alertChannelId', 'alertRoleId', 'alertPingMode',
                'liveEmbedChannelId', 'liveEmbedMode',
            ]);
            const VALID_PING_MODES = ['both', 'online', 'offline'];
            const VALID_EMBED_MODES = ['edit', 'resend'];

            for (const [key, value] of Object.entries(updates)) {
                const match = key.match(/^mcServer_(\d+)_(\w+)$/);
                if (!match) continue;

                const idx = parseInt(match[1], 10);
                const field = match[2];
                if (!MC_SUB_FIELDS.has(field) || idx >= config.mcServers.length) continue;

                // Validate field values
                if (field === 'alertPingMode' && !VALID_PING_MODES.includes(value)) continue;
                if (field === 'liveEmbedMode' && !VALID_EMBED_MODES.includes(value)) continue;
                if ((field === 'alertChannelId' || field === 'alertRoleId' || field === 'liveEmbedChannelId')
                    && typeof value === 'string' && value !== '' && !/^\d{17,20}$/.test(value)) continue;

                config.mcServers[idx][field] = typeof value === 'string' ? value : '';
            }
            config.markModified('mcServers');
        }

        await config.save();

        // Return updated values
        const values = {};
        for (const field of featureDef.fields) {
            values[field] = config[field];
        }

        res.json(values);
    } catch (err) {
        console.error('Failed to update feature:', err);
        res.status(500).json({ error: 'Failed to update feature' });
    }
});

// ============================================================
// SETTINGS (global guild settings)
// ============================================================

// Helper to safely convert a numeric color to hex string
function colorToHex(value, fallback = '#000000') {
    if (value == null) return fallback;
    return `#${value.toString(16).padStart(6, '0')}`;
}

// GET /guild/:id/settings
router.get('/:id/settings', async (req, res) => {
    try {
        const guildId = req.params.id;
        let config = await GuildConfiguration.findOne({ guildId });
        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        res.json({
            values: {
                welcomeMessage: config.welcomeMessage,
                goodbyeMessage: config.goodbyeMessage,
                welcomeEmbed: config.welcomeEmbed,
                welcomeColor: colorToHex(config.welcomeColor, '#00aa00'),
                goodbyeColor: colorToHex(config.goodbyeColor, '#ff0000'),
                suggestionCooldownMs: config.suggestionCooldownMs / 1000,
            },
        });
    } catch (err) {
        console.error('Failed to get settings:', err);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PATCH /guild/:id/settings
router.patch('/:id/settings', async (req, res) => {
    try {
        const guildId = req.params.id;
        const updates = req.body;

        if (!isObject(updates)) {
            return res.status(400).json({ error: 'Body must be a JSON object' });
        }

        let config = await GuildConfiguration.findOne({ guildId });
        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        const SETTINGS_FIELDS = [
            'welcomeMessage', 'goodbyeMessage', 'welcomeEmbed',
            'welcomeColor', 'goodbyeColor', 'suggestionCooldownMs',
        ];

        const settingsSet = new Set(SETTINGS_FIELDS);
        for (const [key, value] of Object.entries(updates)) {
            if (!settingsSet.has(key)) continue;

            // Type validation per field
            if (key === 'welcomeMessage' || key === 'goodbyeMessage') {
                if (typeof value !== 'string' || value.length > 2000) {
                    return res.status(400).json({ error: `${key} must be a string (max 2000 chars)` });
                }
            } else if (key === 'welcomeEmbed') {
                if (typeof value !== 'boolean') {
                    return res.status(400).json({ error: 'welcomeEmbed must be a boolean' });
                }
            } else if (key === 'welcomeColor' || key === 'goodbyeColor') {
                if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) {
                    return res.status(400).json({ error: `${key} must be a hex color string (#RRGGBB)` });
                }
            } else if (key === 'suggestionCooldownMs') {
                if (typeof value !== 'number' || value < 0 || value > 86400) {
                    return res.status(400).json({ error: 'suggestionCooldownMs must be a number in seconds (0-86400)' });
                }
            }

            // Convert hex color strings to numbers for DB storage
            if ((key === 'welcomeColor' || key === 'goodbyeColor') && typeof value === 'string') {
                config[key] = parseInt(value.replace('#', ''), 16);
            } else if (key === 'suggestionCooldownMs') {
                config[key] = value * 1000;
            } else {
                config[key] = value;
            }
        }

        await config.save();

        res.json({
            welcomeMessage: config.welcomeMessage,
            goodbyeMessage: config.goodbyeMessage,
            welcomeEmbed: config.welcomeEmbed,
            welcomeColor: colorToHex(config.welcomeColor, '#00aa00'),
            goodbyeColor: colorToHex(config.goodbyeColor, '#ff0000'),
            suggestionCooldownMs: config.suggestionCooldownMs / 1000,
        });
    } catch (err) {
        console.error('Failed to update settings:', err);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// ============================================================
// ACTIONS (Purge, Timeout management via dashboard)
// ============================================================

// GET /guild/:id/actions - Get actions data
router.get('/:id/actions', async (req, res) => {
    try {
        const guildId = req.params.id;
        const [modLogs, suggestions] = await Promise.all([
            ModLog.find({ guildId }).sort({ createdAt: -1 }).limit(50).lean(),
            Suggestion.find({ guildId }).sort({ createdAt: -1 }).limit(50).lean(),
        ]);

        res.json({
            modLogs: modLogs.map(l => ({
                id: l._id,
                action: l.action,
                targetId: l.targetId,
                moderatorId: l.moderatorId,
                reason: l.reason,
                duration: l.duration,
                createdAt: l.createdAt,
            })),
            suggestions: suggestions.map(s => ({
                id: s.suggestionId,
                content: s.content,
                status: s.status,
                authorId: s.authorId,
                upvotes: s.upvotes.length,
                downvotes: s.downvotes.length,
                createdAt: s.createdAt,
            })),
        });
    } catch (err) {
        console.error('Failed to get actions data:', err);
        res.status(500).json({ error: 'Failed to fetch actions data' });
    }
});

// GET /guild/:id/action/:actionId - Get action detail (tasks)
router.get('/:id/action/:actionId', async (req, res) => {
    try {
        const { id: guildId, actionId } = req.params;

        if (actionId === 'manage_suggestions') {
            const suggestions = await Suggestion.find({ guildId })
                .sort({ createdAt: -1 }).limit(50).lean();

            res.json({
                tasks: suggestions.map(s => ({
                    id: s.suggestionId,
                    name: s.content.substring(0, 50),
                    status: s.status,
                    createdAt: s.createdAt,
                })),
            });
        } else if (actionId === 'mod_history') {
            const logs = await ModLog.find({ guildId })
                .sort({ createdAt: -1 }).limit(50).lean();

            res.json({
                tasks: logs.map(l => ({
                    id: l._id.toString(),
                    name: `${l.action} - ${l.targetId} by ${l.moderatorId}`,
                    status: l.action,
                    createdAt: l.createdAt,
                })),
            });
        } else {
            res.status(404).json({ error: 'Unknown action' });
        }
    } catch (err) {
        console.error('Failed to get action detail:', err);
        res.status(500).json({ error: 'Failed to fetch action detail' });
    }
});

// GET /guild/:id/action/:actionId/:taskId - Get task detail
router.get('/:id/action/:actionId/:taskId', async (req, res) => {
    try {
        const { id: guildId, actionId, taskId } = req.params;

        if (actionId === 'manage_suggestions') {
            const suggestion = await Suggestion.findOne({
                guildId,
                suggestionId: taskId,
            }).lean();

            if (!suggestion) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            res.json({
                id: suggestion.suggestionId,
                name: suggestion.content.substring(0, 50),
                createdAt: suggestion.createdAt,
                values: {
                    content: suggestion.content,
                    status: suggestion.status,
                    reason: suggestion.reason,
                    authorId: suggestion.authorId,
                    upvotes: suggestion.upvotes.length,
                    downvotes: suggestion.downvotes.length,
                },
            });
        } else if (actionId === 'mod_history') {
            if (!isValidObjectId(taskId)) {
                return res.status(400).json({ error: 'Invalid task ID format' });
            }
            const log = await ModLog.findById(taskId).lean();

            if (!log || log.guildId !== guildId) {
                return res.status(404).json({ error: 'Log entry not found' });
            }

            res.json({
                id: log._id.toString(),
                name: `${log.action} - ${log.targetId} by ${log.moderatorId}`,
                createdAt: log.createdAt,
                values: {
                    action: log.action,
                    targetId: log.targetId,
                    moderatorId: log.moderatorId,
                    reason: log.reason,
                    duration: log.duration,
                },
            });
        } else {
            res.status(404).json({ error: 'Unknown action' });
        }
    } catch (err) {
        console.error('Failed to get task detail:', err);
        res.status(500).json({ error: 'Failed to fetch task detail' });
    }
});

// PATCH /guild/:id/action/:actionId/:taskId - Update task
router.patch('/:id/action/:actionId/:taskId', async (req, res) => {
    try {
        const { id: guildId, actionId, taskId } = req.params;

        if (!isObject(req.body) || !isObject(req.body.options)) {
            return res.status(400).json({ error: 'Body must contain { options: {} }' });
        }
        const { options } = req.body;

        if (actionId === 'manage_suggestions') {
            const suggestion = await Suggestion.findOne({
                guildId,
                suggestionId: taskId,
            });

            if (!suggestion) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            if (options.status) {
                if (!VALID_SUGGESTION_STATUSES.includes(options.status)) {
                    return res.status(400).json({ error: 'Invalid status value' });
                }
                suggestion.status = options.status;
            }
            if (options.reason !== undefined) {
                if (typeof options.reason !== 'string' || options.reason.length > 2000) {
                    return res.status(400).json({ error: 'Reason must be a string (max 2000 chars)' });
                }
                suggestion.reason = options.reason;
            }
            await suggestion.save();

            res.json({
                id: suggestion.suggestionId,
                name: suggestion.content.substring(0, 50),
                createdAt: suggestion.createdAt,
                values: {
                    content: suggestion.content,
                    status: suggestion.status,
                    reason: suggestion.reason,
                },
            });
        } else {
            res.status(404).json({ error: 'Action does not support updates' });
        }
    } catch (err) {
        console.error('Failed to update task:', err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// POST /guild/:id/action/:actionId - Add task (create suggestion from dashboard)
router.post('/:id/action/:actionId', async (req, res) => {
    try {
        const { id: guildId, actionId } = req.params;

        if (!isObject(req.body)) {
            return res.status(400).json({ error: 'Body must be a JSON object' });
        }
        const { name, options } = req.body;

        if (actionId === 'manage_suggestions') {
            if (!isObject(options)) {
                return res.status(400).json({ error: 'Body must contain { options: {} }' });
            }
            const content = options.content || name || '';
            if (!content || typeof content !== 'string' || content.length > 4000) {
                return res.status(400).json({ error: 'Content is required (max 4000 chars)' });
            }
            if (options.status && !VALID_SUGGESTION_STATUSES.includes(options.status)) {
                return res.status(400).json({ error: 'Invalid status value' });
            }
            const suggestion = await Suggestion.create({
                guildId,
                authorId: req.user.id,
                messageId: `dashboard-${randomUUID()}`,
                content,
                status: options.status || 'pending',
                reason: typeof options.reason === 'string' ? options.reason.slice(0, 2000) : '',
            });

            res.json({
                id: suggestion.suggestionId,
                name: suggestion.content.substring(0, 50),
                createdAt: suggestion.createdAt,
                values: {
                    content: suggestion.content,
                    status: suggestion.status,
                    reason: suggestion.reason,
                },
            });
        } else {
            res.status(404).json({ error: 'Action does not support creation' });
        }
    } catch (err) {
        console.error('Failed to create task:', err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// DELETE /guild/:id/action/:actionId/:taskId - Delete task
router.delete('/:id/action/:actionId/:taskId', async (req, res) => {
    try {
        const { id: guildId, actionId, taskId } = req.params;

        if (actionId === 'manage_suggestions') {
            const result = await Suggestion.findOneAndDelete({
                guildId,
                suggestionId: taskId,
            });

            if (!result) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            res.sendStatus(200);
        } else if (actionId === 'mod_history') {
            if (!isValidObjectId(taskId)) {
                return res.status(400).json({ error: 'Invalid task ID format' });
            }
            const log = await ModLog.findById(taskId).lean();

            if (!log || log.guildId !== guildId) {
                return res.status(404).json({ error: 'Log entry not found' });
            }

            await ModLog.findByIdAndDelete(taskId);
            res.sendStatus(200);
        } else {
            res.status(404).json({ error: 'Unknown action' });
        }
    } catch (err) {
        console.error('Failed to delete task:', err);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// ============================================================
// XP LEADERBOARD DATA
// ============================================================

// GET /guild/:id/leaderboard - XP leaderboard
router.get('/:id/leaderboard', async (req, res) => {
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
