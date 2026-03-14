const { FEATURE_CONTRACT } = require('../../config/configContract');

const FEATURE_FIELDS = {
    welcome: {
        enableCheck: (c) => !!c.welcomeChannelId,
        fields: FEATURE_CONTRACT.welcome,
    },
    xp: {
        enableCheck: (c) => !c.xpDisableLevelUpMessages,
        fields: FEATURE_CONTRACT.xp,
    },
    suggestions: {
        enableCheck: (c) => c.suggestionChannelIds.length > 0,
        fields: FEATURE_CONTRACT.suggestions,
    },
    minecraft: {
        enableCheck: (c) => c.pingEnabled,
        fields: FEATURE_CONTRACT.minecraft,
    },
    modlog: {
        enableCheck: (c) => !!c.modLogChannelId,
        fields: FEATURE_CONTRACT.modlog,
    },
    reaction_roles: {
        enableCheck: (c) => (c.reactionRoles || []).length > 0,
        fields: FEATURE_CONTRACT.reaction_roles,
    },
    automod: {
        enableCheck: (c) => !!c.automodEnabled,
        fields: FEATURE_CONTRACT.automod,
    },
    starboard: {
        enableCheck: (c) => !!c.starboardEnabled,
        fields: FEATURE_CONTRACT.starboard,
    },
    tickets: {
        enableCheck: (c) => !!c.ticketEnabled,
        fields: FEATURE_CONTRACT.tickets,
    },
    custom_commands: {
        enableCheck: () => true,
        fields: FEATURE_CONTRACT.custom_commands,
        virtual: true,
    },
    announcements: {
        enableCheck: () => true,
        fields: FEATURE_CONTRACT.announcements,
        virtual: true,
    },
    temp_roles: {
        enableCheck: () => true,
        fields: FEATURE_CONTRACT.temp_roles,
        virtual: true,
    },
    giveaways: {
        enableCheck: () => true,
        fields: FEATURE_CONTRACT.giveaways,
        virtual: true,
    },
    music: {
        enableCheck: (c) => c.musicEnabled !== false,
        fields: FEATURE_CONTRACT.music,
    },
    auto_responder: {
        enableCheck: () => true,
        fields: FEATURE_CONTRACT.auto_responder,
        virtual: true,
    },
    afk: {
        enableCheck: () => true,
        fields: FEATURE_CONTRACT.afk,
        virtual: true,
    },
};

function applyFeatureToggle(config, featureId, enabled) {
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
}

module.exports = {
    FEATURE_FIELDS,
    applyFeatureToggle,
};
