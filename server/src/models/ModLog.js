const { Schema, model } = require('mongoose');

const modLogSchema = new Schema({
    guildId: { type: String, required: true },
    targetId: { type: String, required: true },
    moderatorId: { type: String, required: true },
    action: { type: String, required: true },
    reason: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

modLogSchema.index({ guildId: 1, targetId: 1 });
modLogSchema.index({ guildId: 1, createdAt: -1 });

module.exports = model('ModLog', modLogSchema);
