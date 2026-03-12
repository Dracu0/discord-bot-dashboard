const router = require('express').Router({ mergeParams: true });
const GuildConfiguration = require('../../models/GuildConfiguration');
const AuditLog = require('../../models/AuditLog');
const logger = require('../../utils/logger');
const { publishConfigInvalidation } = require('../../utils/redis');
const { isObject, colorToHex } = require('./helpers');
const { badRequest, sendApiError } = require('../../utils/apiError');

// GET /guild/:id/settings
router.get('/', async (req, res) => {
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
        req.log?.error('settings_fetch_failed', { guildId: req.params.id, error: err });
        sendApiError(res, err, 'Failed to fetch settings');
    }
});

// PATCH /guild/:id/settings
router.patch('/', async (req, res) => {
    try {
        const guildId = req.params.id;
        const updates = req.body;

        if (!isObject(updates)) {
            return sendApiError(res, badRequest('Body must be a JSON object', {
                field: 'body',
                expected: 'object',
            }));
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

            if (key === 'welcomeMessage' || key === 'goodbyeMessage') {
                if (typeof value !== 'string' || value.length > 2000) {
                    return sendApiError(res, badRequest(`${key} must be a string (max 2000 chars)`, {
                        field: key,
                        expected: 'string<=2000',
                    }));
                }
            } else if (key === 'welcomeEmbed') {
                if (typeof value !== 'boolean') {
                    return sendApiError(res, badRequest('welcomeEmbed must be a boolean', {
                        field: 'welcomeEmbed',
                        expected: 'boolean',
                    }));
                }
            } else if (key === 'welcomeColor' || key === 'goodbyeColor') {
                if (typeof value !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(value)) {
                    return sendApiError(res, badRequest(`${key} must be a hex color string (#RRGGBB)`, {
                        field: key,
                        expected: 'hex-color',
                    }));
                }
            } else if (key === 'suggestionCooldownMs') {
                if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 86400) {
                    return sendApiError(res, badRequest('Suggestion cooldown must be between no cooldown and 24 hours', {
                        field: 'suggestionCooldownMs',
                        expected: 'number(0..86400)',
                    }));
                }
            }

            if ((key === 'welcomeColor' || key === 'goodbyeColor') && typeof value === 'string') {
                config[key] = parseInt(value.replace('#', ''), 16);
            } else if (key === 'suggestionCooldownMs') {
                config[key] = value * 1000;
            } else {
                config[key] = value;
            }
        }

        await config.save();
        publishConfigInvalidation(guildId);

        AuditLog.create({
            guildId,
            actorId: req.user?.id || 'unknown',
            actorTag: req.user?.username || '',
            source: 'dashboard',
            category: 'config.settings',
            action: 'update',
            target: Object.keys(updates).join(', '),
            after: updates,
        }).catch(err => logger.warn('audit_log_write_failed', { error: err.message, guildId }));

        req.log?.info('settings_updated', {
            guildId,
            updatedKeys: Object.keys(updates),
            actorId: req.user?.id || null,
        });

        res.json({
            welcomeMessage: config.welcomeMessage,
            goodbyeMessage: config.goodbyeMessage,
            welcomeEmbed: config.welcomeEmbed,
            welcomeColor: colorToHex(config.welcomeColor, '#00aa00'),
            goodbyeColor: colorToHex(config.goodbyeColor, '#ff0000'),
            suggestionCooldownMs: config.suggestionCooldownMs / 1000,
        });
    } catch (err) {
        req.log?.error('settings_update_failed', { guildId: req.params.id, error: err });
        sendApiError(res, err, 'Failed to update settings');
    }
});

module.exports = router;
