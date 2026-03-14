const CONFIG_SCHEMA_VERSION = 1;

const FEATURE_CONTRACT = {
    welcome: ['welcomeChannelId', 'welcomeMessage', 'goodbyeMessage', 'welcomeEmbed', 'welcomeColor', 'goodbyeColor', 'autoRoleIds'],
    xp: ['xpIgnoredChannelIds', 'xpLevelUpChannelId', 'xpDisableLevelUpMessages', 'levelRoles', 'xpChannelMultipliers', 'xpRoleMultipliers'],
    suggestions: ['suggestionChannelIds', 'suggestionCooldownMs'],
    minecraft: ['pingEnabled', 'mcServers'],
    modlog: ['modLogChannelId', 'warnThresholds'],
    reaction_roles: ['reactionRoles'],
    automod: [
        'automodEnabled', 'automodBannedWords', 'automodBlockInvites', 'automodBlockLinks',
        'automodAllowedLinkDomains', 'automodAntiSpamEnabled', 'automodAntiSpamMaxMessages',
        'automodAntiSpamInterval', 'automodAction', 'automodTimeoutDuration',
        'automodExemptRoleIds', 'automodExemptChannelIds', 'automodLogChannelId',
    ],
    starboard: ['starboardEnabled', 'starboardChannelId', 'starboardThreshold', 'starboardEmoji'],
    tickets: ['ticketEnabled', 'ticketCategoryId', 'ticketSupportRoleIds', 'ticketLogChannelId', 'ticketMaxOpen'],
    custom_commands: [],
    announcements: [],
    temp_roles: [],
    giveaways: [],
    music: ['musicEnabled', 'musicDJRoleId', 'musicMaxQueueSize'],
    auto_responder: [],
    afk: [],
};

module.exports = {
    CONFIG_SCHEMA_VERSION,
    FEATURE_CONTRACT,
};
