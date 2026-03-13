const router = require('express').Router({ mergeParams: true });
const GuildConfiguration = require('../../models/GuildConfiguration');
const AuditLog = require('../../models/AuditLog');
const { publishConfigInvalidation } = require('../../utils/redis');
const logger = require('../../utils/logger');
const CustomCommand = require('../../models/CustomCommand');
const ScheduledMessage = require('../../models/ScheduledMessage');
const TempRole = require('../../models/TempRole');
const Giveaway = require('../../models/Giveaway');
const AutoResponder = require('../../models/AutoResponder');
const { fetchGuildChannels, fetchGuildRoles, addGuildMemberRole, removeGuildMemberRole, sendChannelMessage, addMessageReaction } = require('../../utils/discord');
const { isObject, isValidObjectId } = require('./helpers');
const { badRequest, notFound, sendApiError } = require('../../utils/apiError');

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
    music: {
        enableCheck: (c) => c.musicEnabled !== false,
        fields: ['musicEnabled', 'musicDJRoleId', 'musicMaxQueueSize'],
    },
    auto_responder: {
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
        sendApiError(res, err, 'Failed to fetch features');
    }
});

// PATCH /guild/:id/feature/:featureId/enabled
router.patch('/:featureId/enabled', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;

        if (!isObject(req.body) || typeof req.body.enabled !== 'boolean') {
            return sendApiError(res, badRequest('Body must be { enabled: boolean }', {
                field: 'enabled',
                expected: 'boolean',
            }));
        }
        const { enabled } = req.body;

        const featureDef = FEATURE_FIELDS[featureId];
        if (!featureDef) {
            return sendApiError(res, notFound('Unknown feature', { featureId }));
        }

        // Virtual features (custom_commands, announcements, etc.) have no enable/disable toggle
        if (featureDef.virtual) {
            return sendApiError(res, badRequest('This feature cannot be toggled — it is always available', {
                featureId,
            }));
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
            case 'music':
                config.musicEnabled = enabled;
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
        sendApiError(res, err, 'Failed to toggle feature');
    }
});

// GET /guild/:id/feature/:featureId
router.get('/:featureId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;

        const featureDef = FEATURE_FIELDS[featureId];
        if (!featureDef) {
            return sendApiError(res, notFound('Unknown feature', { featureId }));
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
        } else if (featureId === 'auto_responder') {
            values.autoResponders = (await AutoResponder.find({ guildId }).sort({ order: 1, createdAt: 1, name: 1 }).lean())
                .map((item, index) => {
                    const normalized = normalizeAutoResponderOutput(item);
                    const order = Number(normalized?.order);
                    return {
                        ...normalized,
                        order: Number.isFinite(order) && order >= 0 ? order : index,
                    };
                });
        }

        res.json({ values });
    } catch (err) {
        req.log?.error('feature_detail_fetch_failed', { guildId: req.params.id, featureId: req.params.featureId, error: err });
        sendApiError(res, err, 'Failed to fetch feature detail');
    }
});

// PATCH /guild/:id/feature/:featureId
router.patch('/:featureId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
        const updates = req.body;

        if (!isObject(updates)) {
            return sendApiError(res, badRequest('Body must be a JSON object', {
                field: 'body',
                expected: 'object',
            }));
        }

        const featureDef = FEATURE_FIELDS[featureId];
        if (!featureDef) {
            return sendApiError(res, notFound('Unknown feature', { featureId }));
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
            else if (key === 'musicMaxQueueSize' && typeof value === 'number' && Number.isFinite(value)) {
                if (value < 1 || value > 500) {
                    return res.status(400).json({ error: 'Max queue size must be between 1 and 500' });
                }
                config[key] = Math.round(value);
            }
            else if (typeof value === 'boolean' && [
                'pingEnabled', 'welcomeEmbed', 'xpDisableLevelUpMessages',
                'automodEnabled', 'automodBlockInvites', 'automodBlockLinks', 'automodAntiSpamEnabled',
                'starboardEnabled', 'ticketEnabled', 'musicEnabled',
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
        sendApiError(res, err, 'Failed to update feature');
    }
});

// ─── Collection-based CRUD for virtual features ─────────────────────────

const DISCORD_ID_RE = /^\d{17,20}$/;
const CUSTOM_EMOJI_RE = /^<a?:\w{2,32}:\d{17,20}>$/;

function normalizeAutoResponderResponses(body) {
    return normalizeAutoResponderResponseList(body?.responses, body?.response);
}

function normalizeAutoResponderResponseList(listLike, fallback = '') {
    let responses = [];

    if (Array.isArray(listLike)) {
        responses = listLike
            .map((v) => (typeof v === 'string' ? v.trim() : ''))
            .filter(Boolean)
            .slice(0, 20)
            .map((v) => v.slice(0, 2000));
    }

    if (!responses.length && typeof fallback === 'string') {
        const single = fallback.trim();
        if (single) responses = [single.slice(0, 2000)];
    }

    return responses;
}

function normalizeAutoResponderOutput(docLike) {
    const source = docLike?.toObject ? docLike.toObject() : { ...(docLike || {}) };
    const responses = normalizeAutoResponderResponseList(source.responses, source.response);
    return {
        ...source,
        responses,
        response: responses[0] || '',
    };
}

function getRegexValidationError(pattern) {
    try {
        // Validation-only compile. Runtime behavior remains in bot side.
        new RegExp(pattern, 'i');
        return null;
    } catch (err) {
        return err?.message || 'Invalid regex pattern';
    }
}

// POST /guild/:id/feature/:featureId/items — Create item
router.post('/:featureId/items', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
        const body = req.body;

        if (!isObject(body)) {
            return sendApiError(res, badRequest('Body must be a JSON object', {
                field: 'body',
                expected: 'object',
            }));
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
                } catch {
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
                } catch {
                    return res.status(502).json({ error: 'Failed to send giveaway message — check bot permissions in the target channel' });
                }

                // Add reaction
                try {
                    await addMessageReaction(channelId, msg.id, '🎉');
                } catch { /* non-critical */ }

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

            case 'auto_responder': {
                const { name, trigger, matchMode, ignoreBots, cooldownMs, enabled, randomizeResponses } = body;
                if (!name || typeof name !== 'string' || name.length > 32) {
                    return sendApiError(res, badRequest('Name is required (max 32 chars)', {
                        field: 'name',
                        maxLength: 32,
                    }));
                }
                if (!trigger || typeof trigger !== 'string' || trigger.length > 200) {
                    return sendApiError(res, badRequest('Trigger is required (max 200 chars)', {
                        field: 'trigger',
                        maxLength: 200,
                    }));
                }
                const VALID_MATCH_MODES = ['contains', 'exact', 'startsWith', 'regex'];
                if (!matchMode || !VALID_MATCH_MODES.includes(matchMode)) {
                    return sendApiError(res, badRequest('Match mode must be one of: contains, exact, startsWith, regex', {
                        field: 'matchMode',
                        expected: VALID_MATCH_MODES,
                    }));
                }
                if (matchMode === 'regex') {
                    const regexErr = getRegexValidationError(trigger);
                    if (regexErr) {
                        return sendApiError(res, badRequest('Invalid regex pattern', {
                            field: 'trigger',
                            reason: regexErr,
                        }));
                    }
                }
                const responses = normalizeAutoResponderResponses(body);
                if (!responses.length) {
                    return sendApiError(res, badRequest('At least one response is required (max 2000 chars each)', {
                        field: 'responses',
                    }));
                }
                const count = await AutoResponder.countDocuments({ guildId });
                if (count >= 25) {
                    return sendApiError(res, badRequest('Maximum 25 auto-responders per server', {
                        field: 'autoResponders',
                        limit: 25,
                    }));
                }
                const existingAR = await AutoResponder.findOne({ guildId, name: name.trim() });
                if (existingAR) {
                    return sendApiError(res, {
                        status: 409,
                        code: 'CONFLICT',
                        message: `Auto-responder "${name.trim()}" already exists`,
                        details: { field: 'name' },
                    });
                }
                const highestOrder = await AutoResponder.findOne({ guildId })
                    .sort({ order: -1, createdAt: -1 })
                    .select('order')
                    .lean();
                const highestOrderValue = Number(highestOrder?.order);
                const fallbackCount = await AutoResponder.countDocuments({ guildId });
                const nextOrder = Number.isFinite(highestOrderValue) ? highestOrderValue + 1 : fallbackCount;

                created = await AutoResponder.create({
                    guildId,
                    name: name.trim().slice(0, 32),
                    trigger: trigger.slice(0, 200),
                    matchMode,
                    response: responses[0],
                    responses,
                    randomizeResponses: !!randomizeResponses,
                    order: nextOrder,
                    enabled: enabled !== false,
                    ignoreBots: ignoreBots !== false,
                    cooldownMs: Math.max(0, Math.min(300000, Math.round(Number(cooldownMs) || 5000))),
                    createdBy: req.user?.id || '',
                });
                created = normalizeAutoResponderOutput(created);
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
                const trimmedEmoji = emoji.trim();
                if (trimmedEmoji.length > 60 && !CUSTOM_EMOJI_RE.test(trimmedEmoji)) {
                    return res.status(400).json({ error: 'Invalid emoji format' });
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
                const added = config.reactionRoles[config.reactionRoles.length - 1];
                created = { _id: added._id.toString(), ...entry };
                break;
            }

            default:
                return sendApiError(res, badRequest('This feature does not support item creation', { featureId }));
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
            return sendApiError(res, { status: 409, code: 'CONFLICT', message: 'An item with that identifier already exists' });
        }
        req.log?.error('feature_item_create_failed', { guildId: req.params.id, featureId: req.params.featureId, error: err });
        sendApiError(res, err, 'Failed to create item');
    }
});

// PATCH /guild/:id/feature/:featureId/items/reorder — Reorder collection items
router.patch('/:featureId/items/reorder', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;

        if (!isObject(req.body) || !Array.isArray(req.body.itemIds)) {
            return sendApiError(res, badRequest('Body must be { itemIds: string[] }', {
                field: 'itemIds',
                expected: 'string[]',
            }));
        }

        if (featureId !== 'auto_responder') {
            return sendApiError(res, badRequest('This feature does not support custom ordering', { featureId }));
        }

        const itemIds = req.body.itemIds.map((id) => String(id));
        if (!itemIds.length) {
            return sendApiError(res, badRequest('itemIds cannot be empty', {
                field: 'itemIds',
            }));
        }

        if (new Set(itemIds).size !== itemIds.length) {
            return sendApiError(res, badRequest('itemIds must not contain duplicates', {
                field: 'itemIds',
            }));
        }

        if (itemIds.some((id) => !isValidObjectId(id))) {
            return sendApiError(res, badRequest('All itemIds must be valid ObjectIds', {
                field: 'itemIds',
                expected: 'ObjectId[]',
            }));
        }

        const existing = await AutoResponder.find({ guildId, _id: { $in: itemIds } })
            .select('_id')
            .lean();

        if (existing.length !== itemIds.length) {
            return sendApiError(res, badRequest('One or more items were not found for this guild', {
                field: 'itemIds',
            }));
        }

        await AutoResponder.bulkWrite(
            itemIds.map((id, index) => ({
                updateOne: {
                    filter: { guildId, _id: id },
                    update: { $set: { order: index } },
                },
            })),
            { ordered: true },
        );

        const ordered = (await AutoResponder.find({ guildId, _id: { $in: itemIds } })
            .sort({ order: 1, createdAt: 1, name: 1 })
            .lean())
            .map((item) => normalizeAutoResponderOutput(item));

        publishConfigInvalidation(guildId);

        AuditLog.create({
            guildId,
            actorId: req.user?.id || 'unknown',
            actorTag: req.user?.username || '',
            source: 'dashboard',
            category: `items.${featureId}`,
            action: 'reorder',
            target: itemIds.join(','),
            after: itemIds,
        }).catch(err => logger.warn('audit_log_write_failed', { error: err.message, guildId, featureId }));

        res.json({ items: ordered });
    } catch (err) {
        req.log?.error('feature_items_reorder_failed', { guildId: req.params.id, featureId: req.params.featureId, error: err });
        sendApiError(res, err, 'Failed to reorder items');
    }
});

// Features that store items in dedicated MongoDB collections (use ObjectId)
const OBJECTID_FEATURES = new Set(['custom_commands', 'announcements', 'temp_roles', 'giveaways', 'auto_responder']);

// PATCH /guild/:id/feature/:featureId/items/:itemId — Update item
router.patch('/:featureId/items/:itemId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
        const itemId = req.params.itemId;
        const body = req.body;

        if (!isObject(body)) {
            return sendApiError(res, badRequest('Body must be a JSON object', {
                field: 'body',
                expected: 'object',
            }));
        }

        if (OBJECTID_FEATURES.has(featureId) && !isValidObjectId(itemId)) {
            return sendApiError(res, badRequest('Invalid item ID', {
                field: 'itemId',
                expected: 'ObjectId',
            }));
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

            case 'auto_responder': {
                const arDoc = await AutoResponder.findOne({ _id: itemId, guildId });
                if (!arDoc) {
                    return sendApiError(res, notFound('Auto-responder not found', {
                        featureId,
                        itemId,
                    }));
                }

                if (body.trigger !== undefined) {
                    if (typeof body.trigger !== 'string' || body.trigger.length > 200) {
                        return sendApiError(res, badRequest('Trigger must be a string (max 200 chars)', {
                            field: 'trigger',
                            maxLength: 200,
                        }));
                    }
                    arDoc.trigger = body.trigger;
                }
                if (body.response !== undefined) {
                    if (typeof body.response !== 'string' || body.response.length > 2000) {
                        return sendApiError(res, badRequest('Response must be a string (max 2000 chars)', {
                            field: 'response',
                            maxLength: 2000,
                        }));
                    }
                    const normalizedSingle = normalizeAutoResponderResponseList(undefined, body.response);
                    if (!normalizedSingle.length) {
                        return sendApiError(res, badRequest('At least one response is required', {
                            field: 'response',
                        }));
                    }
                    arDoc.responses = normalizedSingle;
                    arDoc.response = normalizedSingle[0];
                }
                if (body.responses !== undefined) {
                    if (!Array.isArray(body.responses)) {
                        return sendApiError(res, badRequest('responses must be an array of strings', {
                            field: 'responses',
                        }));
                    }
                    const normalized = normalizeAutoResponderResponses(body);
                    if (!normalized.length) {
                        return sendApiError(res, badRequest('At least one response is required', {
                            field: 'responses',
                        }));
                    }
                    arDoc.responses = normalized;
                    arDoc.response = normalized[0];
                }
                if (body.randomizeResponses !== undefined) {
                    arDoc.randomizeResponses = !!body.randomizeResponses;
                }
                if (body.matchMode !== undefined) {
                    const VALID_MATCH_MODES = ['contains', 'exact', 'startsWith', 'regex'];
                    if (!VALID_MATCH_MODES.includes(body.matchMode)) {
                        return sendApiError(res, badRequest('Invalid match mode', {
                            field: 'matchMode',
                            expected: VALID_MATCH_MODES,
                        }));
                    }
                    arDoc.matchMode = body.matchMode;
                }

                const nextMatchMode = body.matchMode !== undefined ? body.matchMode : arDoc.matchMode;
                const nextTrigger = body.trigger !== undefined ? body.trigger : arDoc.trigger;
                if (nextMatchMode === 'regex') {
                    const regexErr = getRegexValidationError(nextTrigger);
                    if (regexErr) {
                        return sendApiError(res, badRequest('Invalid regex pattern', {
                            field: 'trigger',
                            reason: regexErr,
                        }));
                    }
                }

                if (body.enabled !== undefined) arDoc.enabled = !!body.enabled;
                if (body.ignoreBots !== undefined) arDoc.ignoreBots = !!body.ignoreBots;
                if (body.cooldownMs !== undefined) {
                    arDoc.cooldownMs = Math.max(0, Math.min(300000, Math.round(Number(body.cooldownMs) || 0)));
                }
                await arDoc.save();
                updated = normalizeAutoResponderOutput(arDoc);
                break;
            }

            case 'reaction_roles': {
                let config = await GuildConfiguration.findOne({ guildId });
                let rr = config?.reactionRoles?.id(itemId);
                if (!rr && /^\d+$/.test(itemId)) {
                    rr = config?.reactionRoles?.[Number(itemId)] || null;
                }
                if (!config || !rr) {
                    return res.status(404).json({ error: 'Reaction role not found' });
                }
                if (body.emoji && typeof body.emoji === 'string') {
                    const trimmed = body.emoji.trim();
                    if (trimmed.length > 60 && !CUSTOM_EMOJI_RE.test(trimmed)) {
                        return res.status(400).json({ error: 'Invalid emoji format' });
                    }
                    rr.emoji = trimmed;
                }
                if (body.roleId && DISCORD_ID_RE.test(body.roleId)) {
                    rr.roleId = body.roleId;
                }
                if (body.channelId && DISCORD_ID_RE.test(body.channelId)) {
                    rr.channelId = body.channelId;
                }
                if (body.messageId && DISCORD_ID_RE.test(body.messageId)) {
                    rr.messageId = body.messageId;
                }
                config.markModified('reactionRoles');
                await config.save();
                publishConfigInvalidation(guildId);
                updated = { _id: rr._id ? rr._id.toString() : itemId, ...rr.toObject() };
                break;
            }

            default:
                return sendApiError(res, badRequest('This feature does not support item updates', { featureId }));
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
        sendApiError(res, err, 'Failed to update item');
    }
});

// DELETE /guild/:id/feature/:featureId/items/:itemId — Delete item
router.delete('/:featureId/items/:itemId', async (req, res) => {
    try {
        const { id: guildId } = req.params;
        const featureId = req.params.featureId;
        const itemId = req.params.itemId;

        if (OBJECTID_FEATURES.has(featureId) && !isValidObjectId(itemId)) {
            return sendApiError(res, badRequest('Invalid item ID', {
                field: 'itemId',
                expected: 'ObjectId',
            }));
        }

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
                } catch (err) { logger.warn('temp_role_remove_failed', { guildId, userId: deleted.userId, roleId: deleted.roleId, error: err.message }); }
                break;
            }

            case 'giveaways': {
                deleted = await Giveaway.findOneAndDelete({ _id: itemId, guildId });
                if (!deleted) return res.status(404).json({ error: 'Giveaway not found' });
                break;
            }

            case 'auto_responder': {
                deleted = await AutoResponder.findOneAndDelete({ _id: itemId, guildId });
                if (!deleted) return res.status(404).json({ error: 'Auto-responder not found' });
                break;
            }

            case 'reaction_roles': {
                let config = await GuildConfiguration.findOne({ guildId });
                if (!config) {
                    return res.status(404).json({ error: 'Reaction role not found' });
                }
                let rr = config.reactionRoles?.id(itemId);
                if (rr) {
                    deleted = rr.toObject();
                    config.reactionRoles.pull(itemId);
                } else if (/^\d+$/.test(itemId)) {
                    const index = Number(itemId);
                    if (!Number.isInteger(index) || index < 0 || index >= config.reactionRoles.length) {
                        return res.status(404).json({ error: 'Reaction role not found' });
                    }
                    deleted = config.reactionRoles[index]?.toObject?.() || config.reactionRoles[index];
                    config.reactionRoles.splice(index, 1);
                } else {
                    return res.status(404).json({ error: 'Reaction role not found' });
                }
                config.markModified('reactionRoles');
                await config.save();
                publishConfigInvalidation(guildId);
                break;
            }

            default:
                return sendApiError(res, badRequest('This feature does not support item deletion', { featureId }));
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
        sendApiError(res, err, 'Failed to delete item');
    }
});

module.exports = router;
