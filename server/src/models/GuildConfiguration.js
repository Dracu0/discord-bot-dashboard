const { Schema, model } = require('mongoose');

const mcServerSchema = new Schema({
    name: { type: String, required: true },
    ip: { type: String, required: true },
    alertChannelId: { type: String, default: '' },
    alertRoleId: { type: String, default: '' },
    alertPingMode: { type: String, enum: ['both', 'online', 'offline'], default: 'both' },
    lastOnlineStatus: { type: Boolean, default: null },
    lastStatusChangeAt: { type: Date, default: null },
    liveEmbedChannelId: { type: String, default: '' },
    liveEmbedMessageId: { type: String, default: '' },
    liveEmbedMode: { type: String, enum: ['edit', 'resend'], default: 'edit' },
    peakPlayersToday: { type: Number, default: 0 },
    peakPlayersDate: { type: String, default: '' },
}, { _id: false });

const levelRoleSchema = new Schema({
    level: { type: Number, required: true },
    roleId: { type: String, required: true },
}, { _id: false });

const reactionRoleSchema = new Schema({
    messageId: { type: String, required: true },
    channelId: { type: String, required: true },
    emoji: { type: String, required: true },
    roleId: { type: String, required: true },
}, { _id: false });

const xpMultiplierSchema = new Schema({
    targetId: { type: String, required: true },
    multiplier: { type: Number, required: true, min: 0, max: 10 },
}, { _id: false });

const warnThresholdSchema = new Schema({
    count: { type: Number, required: true, min: 1 },
    action: { type: String, enum: ['timeout', 'kick', 'ban'], required: true },
    duration: { type: Number, default: 0 },
}, { _id: false });

const guildConfigurationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    suggestionChannelIds: {
        type: [String],
        default: [],
        validate: [v => v.length <= 10, 'Maximum 10 suggestion channels'],
    },
    suggestionCooldownMs: {
        type: Number,
        default: 0,
    },
    pingEnabled: {
        type: Boolean,
        default: false,
    },
    mcServers: {
        type: [mcServerSchema],
        default: [],
        validate: [v => v.length <= 10, 'Maximum 10 Minecraft servers'],
    },
    xpIgnoredChannelIds: {
        type: [String],
        default: [],
        validate: [v => v.length <= 50, 'Maximum 50 ignored channels'],
    },
    xpLevelUpChannelId: {
        type: String,
        default: '',
    },
    xpDisableLevelUpMessages: {
        type: Boolean,
        default: false,
    },
    levelRoles: {
        type: [levelRoleSchema],
        default: [],
        validate: [v => v.length <= 50, 'Maximum 50 level roles'],
    },
    welcomeChannelId: {
        type: String,
        default: '',
    },
    welcomeMessage: {
        type: String,
        default: 'Welcome to {server}, {user}! You are member #{membercount}.',
        maxlength: 2000,
    },
    goodbyeMessage: {
        type: String,
        default: '{user} has left {server}. We now have {membercount} members.',
        maxlength: 2000,
    },
    welcomeEmbed: {
        type: Boolean,
        default: true,
    },
    welcomeColor: {
        type: Number,
        default: 0x00AA00,
    },
    goodbyeColor: {
        type: Number,
        default: 0xFF0000,
    },
    autoRoleIds: {
        type: [String],
        default: [],
        validate: [v => v.length <= 25, 'Maximum 25 auto-roles'],
    },
    modLogChannelId: {
        type: String,
        default: '',
    },
    // Reaction roles
    reactionRoles: {
        type: [reactionRoleSchema],
        default: [],
        validate: [v => v.length <= 50, 'Maximum 50 reaction roles'],
    },
    // XP multipliers
    xpChannelMultipliers: {
        type: [xpMultiplierSchema],
        default: [],
        validate: [v => v.length <= 25, 'Maximum 25 channel multipliers'],
    },
    xpRoleMultipliers: {
        type: [xpMultiplierSchema],
        default: [],
        validate: [v => v.length <= 25, 'Maximum 25 role multipliers'],
    },
    // Warn thresholds
    warnThresholds: {
        type: [warnThresholdSchema],
        default: [],
        validate: [v => v.length <= 10, 'Maximum 10 warn thresholds'],
    },
});

module.exports = model('GuildConfiguration', guildConfigurationSchema);
