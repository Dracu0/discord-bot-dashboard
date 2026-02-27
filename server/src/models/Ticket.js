const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    subject: { type: String, default: 'Support Ticket', maxlength: 100 },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    claimedBy: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },
});

ticketSchema.index({ guildId: 1, userId: 1 });
ticketSchema.index({ guildId: 1, status: 1 });

module.exports = model('Ticket', ticketSchema);
