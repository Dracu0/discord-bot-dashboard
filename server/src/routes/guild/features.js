const router = require('express').Router({ mergeParams: true });
const GuildConfiguration = require('../../models/GuildConfiguration');
const AuditLog = require('../../models/AuditLog');
const { publishConfigInvalidation } = require('../../utils/redis');
const logger = require('../../utils/logger');
const CustomCommand = require('../../models/CustomCommand');
const ScheduledMessage = require('../../models/ScheduledMessage');
const TempRole = require('../../models/TempRole');
const Giveaway = require('../../models/Giveaway');
const { fetchGuildChannels, fetchGuildRoles, addGuildMemberRole, removeGuildMemberRole, sendChannelMessage, addMessageReaction } = require('../../utils/discord');
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

        AuditLog.create({
            guildId,
            actorId: req.user?.id || 'unknown',
            actorTag: req.user?.username || '',
            source: 'dashboard',
            category: 'feature.toggle',
            action: enabled ? 'enable' : 'disable',
            target: featureId,
        }).catch(err => logger.warn('audit_log_write_failed', { error: err.message, guildId, featureId }));

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
            else if (key === 'suggestionCooldownMs' && typeof value === 'number' && Number.isFinite(value)) {
                if (value < 0 || value > 24 * 60 * 60 * 1000) {
                    return res.status(400).json({ error: 'Suggestion cooldown must be between no cooldown and 24 hours' });
                }
                config[key] = Math.round(value);
            }
            else if (key === 'automodAntiSpamInterval' && typeof value === 'number' && Number.isFinite(value)) {
                if (value < 1000 || value > 60000) {
                    return res.status(400).json({ error: 'Spam detection window must be between 1 second and 1 minute' });
                }
                config[key] = Math.round(value);
            }
            else if (key === 'automodTimeoutDuration' && typeof value === 'number' && Number.isFinite(value)) {
                if (value < 5000 || value > 28 * 24 * 60 * 60 * 1000) {
                    return res.status(400).json({ error: 'Auto-mod timeout length must be between 5 seconds and 28 days' });
                }
                config[key] = Math.round(value);
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

        AuditLog.create({
            guildId,
            actorId: req.user?.id || 'unknown',
            actorTag: req.user?.username || '',
            source: 'dashboard',
            category: `config.${featureId}`,
            action: 'update',
            target: Object.keys(updates).join(', '),
            after: updates,
        }).catch(err => logger.warn('audit_log_write_failed', { error: err.message, guildId, featureId }));

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

// ─── Collection-based CRUD for virtual features ─────────────────────────

const DISCORD_ID_RE = /^\d{17,20}$/;
const VALID_INTERVALS = {
    'Every 1 hour':     3600000,
    'Every 2 hours':    7200000,
    'Every 4 hours':    14400000,
    'Every 6 hours':    21600000,
    'Every 8 hours':    28800000,
    'Every 12 hours':   43200000,
    'Every 24 hours':   86400000,
};

// POST /guild/:id/feature/:featureId/items — Create item
router.post('/:featureId/items', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
        const body = req.body;

        if (!isObject(body)) {
            return res.status(400).json({ error: 'Body must be a JSON object' });
        }

        let created;

        switch (featureId) {
            case 'custom_commands': {
                const { name, response, description, ephemeral } = body;
                if (!name || typeof name !== 'string' || name.length > 32) {
                    return res.status(400).json({ error: 'Name is required (max 32 chars)' });
                }
                if (!response || typeof response !== 'string' || response.length > 2000) {
                    return res.status(400).json({ error: 'Response is required (max 2000 chars)' });
                }
                const safeName = name.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 32);
                if (!safeName) {
                    return res.status(400).json({ error: 'Name must contain at least one letter or number' });
                }
                const existing = await CustomCommand.findOne({ guildId, name: safeName });
                if (existing) {
                    return res.status(409).json({ error: `Command "${safeName}" already exists` });
                }
                created = await CustomCommand.create({
                    guildId,
                    name: safeName,
                    response: response.slice(0, 2000),
                    description: (description || '').slice(0, 100),
                    ephemeral: !!ephemeral,
                    createdBy: req.user?.id || '',
                });
                break;
            }

            case 'announcements': {
                const { channelId, message, cronLabel, intervalMs, enabled } = body;
                if (!channelId || !DISCORD_ID_RE.test(channelId)) {
                    return res.status(400).json({ error: 'Valid channel is required' });
                }
                if (!message || typeof message !== 'string' || message.length > 2000) {
                    return res.status(400).json({ error: 'Message is required (max 2000 chars)' });
                }
                const interval = Number(intervalMs);
                if (!Number.isFinite(interval) || interval < 60000) {
                    return res.status(400).json({ error: 'Interval must be at least 1 minute' });
                }
                created = await ScheduledMessage.create({
                    guildId,
                    channelId,
                    message: message.slice(0, 2000),
                    cronLabel: cronLabel || '',
                    intervalMs: interval,
                    nextRunAt: new Date(Date.now() + interval),
                    enabled: enabled !== false,
                    createdBy: req.user?.id || '',
                });
                break;
            }

            case 'temp_roles': {
                const { userId, roleId, duration } = body;
                if (!userId || !DISCORD_ID_RE.test(userId)) {
                    return res.status(400).json({ error: 'Valid user ID is required' });
                }
                if (!roleId || !DISCORD_ID_RE.test(roleId)) {
                    return res.status(400).json({ error: 'Valid role is required' });
                }
                const dur = Number(duration);
                if (!Number.isFinite(dur) || dur < 60000 || dur > 30 * 24 * 60 * 60 * 1000) {
                    return res.status(400).json({ error: 'Duration must be between 1 minute and 30 days' });
                }
                const expiresAt = new Date(Date.now() + dur);

                // Assign the role via Discord API
                try {
                    await addGuildMemberRole(guildId, userId, roleId, `Dashboard temp role by ${req.user?.username || 'unknown'}`);
                } catch (apiErr) {
                    return res.status(502).json({ error: 'Failed to assign role — check bot permissions and verify the user is in the server' });
                }

                created = await TempRole.findOneAndUpdate(
                    { guildId, userId, roleId },
                    { assignedBy: req.user?.id || '', expiresAt },
                    { upsert: true, new: true }
                );
                break;
            }

            case 'giveaways': {
                const { channelId, prize, winnersCount, duration } = body;
                if (!channelId || !DISCORD_ID_RE.test(channelId)) {
                    return res.status(400).json({ error: 'Valid channel is required' });
                }
                if (!prize || typeof prize !== 'string' || prize.length > 256) {
                    return res.status(400).json({ error: 'Prize is required (max 256 chars)' });
                }
                const winners = Math.max(1, Math.min(20, Math.floor(Number(winnersCount) || 1)));
                const dur = Number(duration);
                if (!Number.isFinite(dur) || dur < 60000 || dur > 30 * 24 * 60 * 60 * 1000) {
                    return res.status(400).json({ error: 'Duration must be between 1 minute and 30 days' });
                }
                const endsAt = new Date(Date.now() + dur);
                const hostId = req.user?.id || '';

                // Send giveaway embed message
                let msg;
                try {
                    msg = await sendChannelMessage(channelId, {
                        embeds: [{
                            title: '🎉 Giveaway!',
                            description: `**Prize:** ${prize}\n**Winners:** ${winners}\n**Ends:** <t:${Math.floor(endsAt.getTime() / 1000)}:R>\n**Hosted by:** <@${hostId}>\n\nReact with 🎉 to enter!`,
                            color: 0x5865F2,
                            timestamp: endsAt.toISOString(),
                        }],
                    });
                } catch (apiErr) {
                    return res.status(502).json({ error: 'Failed to send giveaway message — check bot permissions in the target channel' });
                }

                // Add reaction
                try {
                    await addMessageReaction(channelId, msg.id, '🎉');
                } catch (_) { /* non-critical */ }

                created = await Giveaway.create({
                    guildId,
                    channelId,
                    messageId: msg.id,
                    prize,
                    winnersCount: winners,
                    hostId,
                    endsAt,
                });
                break;
            }

            case 'reaction_roles': {
                const { messageId, channelId, emoji, roleId } = body;
                if (!messageId || !DISCORD_ID_RE.test(messageId)) {
                    return res.status(400).json({ error: 'Valid message ID is required' });
                }
                if (!channelId || !DISCORD_ID_RE.test(channelId)) {
                    return res.status(400).json({ error: 'Valid channel is required' });
                }
                if (!emoji || typeof emoji !== 'string' || !emoji.trim()) {
                    return res.status(400).json({ error: 'Emoji is required' });
                }
                if (!roleId || !DISCORD_ID_RE.test(roleId)) {
                    return res.status(400).json({ error: 'Valid role is required' });
                }
                let config = await GuildConfiguration.findOne({ guildId });
                if (!config) config = await GuildConfiguration.create({ guildId });
                if ((config.reactionRoles || []).length >= 50) {
                    return res.status(400).json({ error: 'Maximum 50 reaction roles' });
                }
                const entry = { messageId, channelId, emoji: emoji.trim(), roleId };
                config.reactionRoles.push(entry);
                config.markModified('reactionRoles');
                await config.save();
                publishConfigInvalidation(guildId);
                const idx = config.reactionRoles.length - 1;
                created = { _id: String(idx), ...entry };
                break;
            }

            default:
                return res.status(400).json({ error: 'This feature does not support item creation' });
        }

        AuditLog.create({
            guildId,
            actorId: req.user?.id || 'unknown',
            actorTag: req.user?.username || '',
            source: 'dashboard',
            category: `items.${featureId}`,
            action: 'create',
            target: created._id?.toString() || '',
            after: created.toObject ? created.toObject() : created,
        }).catch(err => logger.warn('audit_log_write_failed', { error: err.message }));

        res.status(201).json(created);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'An item with that identifier already exists' });
        }
        req.log?.error('feature_item_create_failed', { guildId: req.params.id, featureId: req.params.featureId, error: err });
        res.status(500).json({ error: 'Failed to create item' });
    }
});

// PATCH /guild/:id/feature/:featureId/items/:itemId — Update item
router.patch('/:featureId/items/:itemId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
        const itemId = req.params.itemId;
        const body = req.body;

        if (!isObject(body)) {
            return res.status(400).json({ error: 'Body must be a JSON object' });
        }

        let updated;

        switch (featureId) {
            case 'custom_commands': {
                const doc = await CustomCommand.findOne({ _id: itemId, guildId });
                if (!doc) return res.status(404).json({ error: 'Command not found' });

                if (body.response !== undefined) {
                    if (typeof body.response !== 'string' || body.response.length > 2000) {
                        return res.status(400).json({ error: 'Response must be a string (max 2000 chars)' });
                    }
                    doc.response = body.response;
                }
                if (body.description !== undefined) {
                    doc.description = String(body.description || '').slice(0, 100);
                }
                if (body.ephemeral !== undefined) {
                    doc.ephemeral = !!body.ephemeral;
                }
                await doc.save();
                updated = doc;
                break;
            }

            case 'announcements': {
                const doc = await ScheduledMessage.findOne({ _id: itemId, guildId });
                if (!doc) return res.status(404).json({ error: 'Announcement not found' });

                if (body.channelId !== undefined) {
                    if (!DISCORD_ID_RE.test(body.channelId)) {
                        return res.status(400).json({ error: 'Invalid channel ID' });
                    }
                    doc.channelId = body.channelId;
                }
                if (body.message !== undefined) {
                    if (typeof body.message !== 'string' || body.message.length > 2000) {
                        return res.status(400).json({ error: 'Message must be a string (max 2000 chars)' });
                    }
                    doc.message = body.message;
                }
                if (body.intervalMs !== undefined) {
                    const interval = Number(body.intervalMs);
                    if (!Number.isFinite(interval) || interval < 60000) {
                        return res.status(400).json({ error: 'Interval must be at least 1 minute' });
                    }
                    doc.intervalMs = interval;
                }
                if (body.cronLabel !== undefined) {
                    doc.cronLabel = String(body.cronLabel || '');
                }
                if (body.enabled !== undefined) {
                    doc.enabled = !!body.enabled;
                }
                await doc.save();
                updated = doc;
                break;
            }

            case 'temp_roles': {
                const doc = await TempRole.findOne({ _id: itemId, guildId });
                if (!doc) return res.status(404).json({ error: 'Temp role not found' });

                if (body.expiresAt !== undefined) {
                    const newExpiry = new Date(body.expiresAt);
                    if (isNaN(newExpiry.getTime()) || newExpiry <= new Date()) {
                        return res.status(400).json({ error: 'Expiry must be a future date' });
                    }
                    doc.expiresAt = newExpiry;
                }
                await doc.save();
                updated = doc;
                break;
            }

            case 'giveaways': {
                const doc = await Giveaway.findOne({ _id: itemId, guildId });
                if (!doc) return res.status(404).json({ error: 'Giveaway not found' });

                if (body.ended === true && !doc.ended) {
                    doc.ended = true;
                }
                await doc.save();
                updated = doc;
                break;
            }

            case 'reaction_roles': {
                const idx = parseInt(itemId, 10);
                let config = await GuildConfiguration.findOne({ guildId });
                if (!config || isNaN(idx) || idx < 0 || idx >= (config.reactionRoles || []).length) {
                    return res.status(404).json({ error: 'Reaction role not found' });
                }
                if (body.emoji && typeof body.emoji === 'string') {
                    config.reactionRoles[idx].emoji = body.emoji.trim();
                }
                if (body.roleId && DISCORD_ID_RE.test(body.roleId)) {
                    config.reactionRoles[idx].roleId = body.roleId;
                }
                if (body.channelId && DISCORD_ID_RE.test(body.channelId)) {
                    config.reactionRoles[idx].channelId = body.channelId;
                }
                if (body.messageId && DISCORD_ID_RE.test(body.messageId)) {
                    config.reactionRoles[idx].messageId = body.messageId;
                }
                config.markModified('reactionRoles');
                await config.save();
                publishConfigInvalidation(guildId);
                updated = { _id: String(idx), ...config.reactionRoles[idx].toObject() };
                break;
            }

            default:
                return res.status(400).json({ error: 'This feature does not support item updates' });
        }

        AuditLog.create({
            guildId,
            actorId: req.user?.id || 'unknown',
            actorTag: req.user?.username || '',
            source: 'dashboard',
            category: `items.${featureId}`,
            action: 'update',
            target: itemId,
            after: body,
        }).catch(err => logger.warn('audit_log_write_failed', { error: err.message }));

        res.json(updated);
    } catch (err) {
        req.log?.error('feature_item_update_failed', { guildId: req.params.id, featureId: req.params.featureId, itemId: req.params.itemId, error: err });
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE /guild/:id/feature/:featureId/items/:itemId — Delete item
router.delete('/:featureId/items/:itemId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
        const itemId = req.params.itemId;

        let deleted;

        switch (featureId) {
            case 'custom_commands': {
                deleted = await CustomCommand.findOneAndDelete({ _id: itemId, guildId });
                if (!deleted) return res.status(404).json({ error: 'Command not found' });
                break;
            }

            case 'announcements': {
                deleted = await ScheduledMessage.findOneAndDelete({ _id: itemId, guildId });
                if (!deleted) return res.status(404).json({ error: 'Announcement not found' });
                break;
            }

            case 'temp_roles': {
                deleted = await TempRole.findOneAndDelete({ _id: itemId, guildId });
                if (!deleted) return res.status(404).json({ error: 'Temp role not found' });

                // Remove the role from the member
                try {
                    await removeGuildMemberRole(guildId, deleted.userId, deleted.roleId, `Dashboard: temp role removed by ${req.user?.username || 'unknown'}`);
                } catch (_) { /* member might have left */ }
                break;
            }

            case 'giveaways': {
                deleted = await Giveaway.findOneAndDelete({ _id: itemId, guildId });
                if (!deleted) return res.status(404).json({ error: 'Giveaway not found' });
                break;
            }

            case 'reaction_roles': {
                const idx = parseInt(itemId, 10);
                let config = await GuildConfiguration.findOne({ guildId });
                if (!config || isNaN(idx) || idx < 0 || idx >= (config.reactionRoles || []).length) {
                    return res.status(404).json({ error: 'Reaction role not found' });
                }
                deleted = config.reactionRoles[idx];
                config.reactionRoles.splice(idx, 1);
                config.markModified('reactionRoles');
                await config.save();
                publishConfigInvalidation(guildId);
                break;
            }

            default:
                return res.status(400).json({ error: 'This feature does not support item deletion' });
        }

        AuditLog.create({
            guildId,
            actorId: req.user?.id || 'unknown',
            actorTag: req.user?.username || '',
            source: 'dashboard',
            category: `items.${featureId}`,
            action: 'delete',
            target: itemId,
            before: deleted?.toObject ? deleted.toObject() : deleted,
        }).catch(err => logger.warn('audit_log_write_failed', { error: err.message }));

        res.sendStatus(204);
    } catch (err) {
        req.log?.error('feature_item_delete_failed', { guildId: req.params.id, featureId: req.params.featureId, itemId: req.params.itemId, error: err });
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

module.exports = router;
