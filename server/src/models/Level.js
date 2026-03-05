const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: String,
    XP: { type: Number, default: 0, min: 0 },
    Level: { type: Number, default: 0, min: 0 },
});

levelSchema.index({ guildId: 1, userId: 1 }, { unique: true });
levelSchema.index({ guildId: 1, Level: -1, XP: -1 });
levelSchema.index({ guildId: 1, XP: -1 });

module.exports = model('level', levelSchema);
