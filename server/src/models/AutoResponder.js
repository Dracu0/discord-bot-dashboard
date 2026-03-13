const { Schema, model } = require('mongoose');

const autoResponderSchema = new Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 32 },
    trigger: { type: String, required: true, maxlength: 200 },
    matchMode: {
        type: String,
        enum: ['contains', 'exact', 'startsWith', 'regex'],
        default: 'contains',
    },
    response: { type: String, required: true, maxlength: 2000 },
    responses: {
        type: [String],
        default: [],
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.length <= 20 && arr.every((v) => typeof v === 'string' && v.length <= 2000),
            message: 'responses must contain at most 20 entries, each <= 2000 chars',
        },
    },
    randomizeResponses: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    ignoreBots: { type: Boolean, default: true },
    allowedChannelIds: { type: [String], default: [] },
    exemptRoleIds: { type: [String], default: [] },
    cooldownMs: { type: Number, default: 5000 },
    createdBy: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

autoResponderSchema.index({ guildId: 1, enabled: 1 });
autoResponderSchema.index({ guildId: 1, name: 1 }, { unique: true });

module.exports = model('AutoResponder', autoResponderSchema);
