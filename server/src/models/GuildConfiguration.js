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

const guildConfigurationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    suggestionChannelIds: {
        type: [String],
        default: [],
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
    },
    xpIgnoredChannelIds: {
        type: [String],
        default: [],
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
    },
    welcomeChannelId: {
        type: String,
        default: '',
    },
    welcomeMessage: {
        type: String,
        default: 'Welcome to {server}, {user}! You are member #{membercount}.',
    },
    goodbyeMessage: {
        type: String,
        default: '{user} has left {server}. We now have {membercount} members.',
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
    },
    modLogChannelId: {
        type: String,
        default: '',
    },
});

module.exports = model('GuildConfiguration', guildConfigurationSchema);
