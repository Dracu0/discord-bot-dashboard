const router = require('express').Router({ mergeParams: true });
const GuildConfiguration = require('../../models/GuildConfiguration');
const { isObject, colorToHex } = require('./helpers');

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
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PATCH /guild/:id/settings
router.patch('/', async (req, res) => {
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

            if ((key === 'welcomeColor' || key === 'goodbyeColor') && typeof value === 'string') {
                config[key] = parseInt(value.replace('#', ''), 16);
            } else if (key === 'suggestionCooldownMs') {
                config[key] = value * 1000;
            } else {
                config[key] = value;
            }
        }

        await config.save();

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
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;
