const { Schema, model } = require('mongoose');

const afkSchema = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    reason: { type: String, required: true, maxlength: 200 },
    timestamp: { type: Date, default: Date.now },
});

afkSchema.index({ guildId: 1, userId: 1 }, { unique: true });
afkSchema.index({ guildId: 1, timestamp: -1 });

module.exports = model('AFK', afkSchema);