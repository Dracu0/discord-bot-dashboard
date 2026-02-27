const { Schema, model } = require('mongoose');

const scheduledMessageSchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    message: { type: String, required: true, maxlength: 2000 },
    cronLabel: { type: String, default: '' },
    intervalMs: { type: Number, required: true },
    nextRunAt: { type: Date, required: true },
    enabled: { type: Boolean, default: true },
    createdBy: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

scheduledMessageSchema.index({ enabled: 1, nextRunAt: 1 });
scheduledMessageSchema.index({ guildId: 1 });

module.exports = model('ScheduledMessage', scheduledMessageSchema);
