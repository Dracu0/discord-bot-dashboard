const { Schema, model } = require('mongoose');

const starboardEntrySchema = new Schema({
    guildId: { type: String, required: true },
    originalMessageId: { type: String, required: true },
    originalChannelId: { type: String, required: true },
    starboardMessageId: { type: String, default: '' },
    starCount: { type: Number, default: 0 },
});

starboardEntrySchema.index({ guildId: 1, originalMessageId: 1 }, { unique: true });

module.exports = model('StarboardEntry', starboardEntrySchema);
