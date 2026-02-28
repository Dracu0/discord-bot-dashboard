const router = require('express').Router({ mergeParams: true });
const GuildConfiguration = require('../../models/GuildConfiguration');
const { publishConfigInvalidation } = require('../../utils/redis');
const CustomCommand = require('../../models/CustomCommand');
const ScheduledMessage = require('../../models/ScheduledMessage');
const TempRole = require('../../models/TempRole');
const Giveaway = require('../../models/Giveaway');
const { fetchGuildChannels, fetchGuildRoles } = require('../../utils/discord');
const { isObject } = require('./helpers');

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
    automod: {
        enableCheck: (c) => !!c.automodEnabled,
        fields: [
            'automodEnabled', 'automodBannedWords', 'automodBlockInvites', 'automodBlockLinks',
            'automodAllowedLinkDomains', 'automodAntiSpamEnabled', 'automodAntiSpamMaxMessages',
            'automodAntiSpamInterval', 'automodAction', 'automodTimeoutDuration',
            'automodExemptRoleIds', 'automodExemptChannelIds', 'automodLogChannelId',
        ],
    },
    starboard: {
        enableCheck: (c) => !!c.starboardEnabled,
        fields: ['starboardEnabled', 'starboardChannelId', 'starboardThreshold', 'starboardEmoji'],
    },
    tickets: {
        enableCheck: (c) => !!c.ticketEnabled,
        fields: ['ticketEnabled', 'ticketCategoryId', 'ticketSupportRoleIds', 'ticketLogChannelId', 'ticketMaxOpen'],
    },
    custom_commands: {
        enableCheck: () => true,
        fields: [],
        virtual: true,
    },
    announcements: {
        enableCheck: () => true,
        fields: [],
        virtual: true,
    },
    temp_roles: {
        enableCheck: () => true,
        fields: [],
        virtual: true,
    },
    giveaways: {
        enableCheck: () => true,
        fields: [],
        virtual: true,
    },
};

// GET /guild/:id/features
router.get('/', async (req, res) => {
    try {
        const guildId = req.params.id;
        let config = await GuildConfiguration.findOne({ guildId });

        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        const enabled = Object.entries(FEATURE_FIELDS)
            .filter(([, def]) => def.enableCheck(config))
            .map(([id]) => id);

        const [channels, roles] = await Promise.all([
            fetchGuildChannels(guildId).catch(() => []),
            fetchGuildRoles(guildId).catch(() => []),
        ]);

        res.json({
            enabled,
            data: {
                channels: channels
                    .filter(ch => ch.type === 0 || ch.type === 4 || ch.type === 5)
                    .map(ch => ({ id: ch.id, name: ch.name, type: ch.type })),
                roles: roles
                    .filter(r => !r.managed && r.name !== '@everyone')
                    .map(r => ({ id: r.id, name: r.name, color: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : null })),
            },
        });
    } catch (err) {
        req.log?.error('features_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch features' });
    }
});

// PATCH /guild/:id/feature/:featureId/enabled
router.patch('/:featureId/enabled', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;

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
            case 'automod':
                config.automodEnabled = enabled;
                break;
            case 'starboard':
                config.starboardEnabled = enabled;
                if (!enabled) config.starboardChannelId = '';
                break;
            case 'tickets':
                config.ticketEnabled = enabled;
                break;
            default:
                break;
        }

        await config.save();
        publishConfigInvalidation(guildId);
        req.log?.info('feature_toggle_updated', {
            guildId,
            featureId,
            enabled,
            actorId: req.user?.id || null,
        });
        res.sendStatus(200);
    } catch (err) {
        req.log?.error('feature_toggle_failed', { guildId: req.params.id, featureId: req.params.featureId, error: err });
        res.status(500).json({ error: 'Failed to toggle feature' });
    }
});

// GET /guild/:id/feature/:featureId
router.get('/:featureId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;

        const featureDef = FEATURE_FIELDS[featureId];
        if (!featureDef) {
            return res.status(404).json({ error: 'Unknown feature' });
        }

        let config = await GuildConfiguration.findOne({ guildId });
        if (!config) {
            config = await GuildConfiguration.create({ guildId });
        }

        const values = {};
        for (const field of featureDef.fields) {
            values[field] = config[field];
        }

        if (featureId === 'custom_commands') {
            values.customCommands = await CustomCommand.find({ guildId }).sort({ name: 1 }).lean();
        } else if (featureId === 'announcements') {
            values.scheduledMessages = await ScheduledMessage.find({ guildId }).sort({ cronLabel: 1 }).lean();
        } else if (featureId === 'temp_roles') {
            values.tempRoles = await TempRole.find({ guildId }).sort({ expiresAt: 1 }).lean();
        } else if (featureId === 'giveaways') {
            values.giveaways = await Giveaway.find({ guildId }).sort({ createdAt: -1 }).limit(20).lean();
        }

        res.json({ values });
    } catch (err) {
        req.log?.error('feature_detail_fetch_failed', { guildId: req.params.id, featureId: req.params.featureId, error: err });
        res.status(500).json({ error: 'Failed to fetch feature detail' });
    }
});

// PATCH /guild/:id/feature/:featureId
router.patch('/:featureId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
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

        const allowedFields = new Set(featureDef.fields);
        for (const [key, value] of Object.entries(updates)) {
            if (!allowedFields.has(key)) continue;

            if (typeof value === 'string' && value.length > 2000) {
                return res.status(400).json({ error: `${key} exceeds maximum length (2000 chars)` });
            }

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
            else if (key === 'mcServers' && Array.isArray(value)) {
                if (value.length > 10) {
                    return res.status(400).json({ error: 'Maximum 10 Minecraft servers' });
                }
                const existing = config.mcServers || [];
                config[key] = value.map((item, i) => {
                    if (typeof item === 'string') {
                        const [name, ...rest] = item.split(':');
                        const ip = rest.join(':');
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
            else if ((key === 'welcomeColor' || key === 'goodbyeColor') && typeof value === 'string') {
                if (!/^#[0-9a-fA-F]{6}$/.test(value)) {
                    return res.status(400).json({ error: `${key} must be a hex color string (#RRGGBB)` });
                }
                config[key] = parseInt(value.replace('#', ''), 16);
            }
            else if (Array.isArray(value) && ['suggestionChannelIds', 'xpIgnoredChannelIds', 'autoRoleIds', 'automodExemptRoleIds', 'automodExemptChannelIds', 'ticketSupportRoleIds'].includes(key)) {
                config[key] = value.filter(v => typeof v === 'string' && /^\d{17,20}$/.test(v));
            }
            else if (Array.isArray(value) && ['automodBannedWords', 'automodAllowedLinkDomains'].includes(key)) {
                const limit = key === 'automodBannedWords' ? 200 : 50;
                if (value.length > limit) {
                    return res.status(400).json({ error: `Maximum ${limit} entries for ${key}` });
                }
                config[key] = value.filter(v => typeof v === 'string' && v.length <= 100).map(v => v.trim()).filter(Boolean);
            }
            else if (typeof value === 'boolean' && [
                'pingEnabled', 'welcomeEmbed', 'xpDisableLevelUpMessages',
                'automodEnabled', 'automodBlockInvites', 'automodBlockLinks', 'automodAntiSpamEnabled',
                'starboardEnabled', 'ticketEnabled',
            ].includes(key)) {
                config[key] = value;
            }
            else if (key === 'automodAction' && typeof value === 'string') {
                if (['delete', 'warn', 'timeout'].includes(value)) {
                    config[key] = value;
                }
            }
            else if (typeof value === 'string') {
                config[key] = value;
            }
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

                if (field === 'alertPingMode' && !VALID_PING_MODES.includes(value)) continue;
                if (field === 'liveEmbedMode' && !VALID_EMBED_MODES.includes(value)) continue;
                if ((field === 'alertChannelId' || field === 'alertRoleId' || field === 'liveEmbedChannelId')
                    && typeof value === 'string' && value !== '' && !/^\d{17,20}$/.test(value)) continue;

                config.mcServers[idx][field] = typeof value === 'string' ? value : '';
            }
            config.markModified('mcServers');
        }

        await config.save();
        publishConfigInvalidation(guildId);

        const values = {};
        for (const field of featureDef.fields) {
            values[field] = config[field];
        }

        req.log?.info('feature_config_updated', {
            guildId,
            featureId,
            updatedKeys: Object.keys(updates),
            actorId: req.user?.id || null,
        });

        res.json(values);
    } catch (err) {
        req.log?.error('feature_config_update_failed', { guildId: req.params.id, featureId: req.params.featureId, error: err });
        res.status(500).json({ error: 'Failed to update feature' });
    }
});

module.exports = router;
