const { Schema, model } = require('mongoose');

const giveawaySchema = new Schema({
    guildId: { type: String, required: true, index: true },
    channelId: { type: String, required: true },
    messageId: { type: String, required: true },
    prize: { type: String, required: true },
    winnersCount: { type: Number, default: 1 },
    hostId: { type: String, required: true },
    endsAt: { type: Date, required: true },
    ended: { type: Boolean, default: false },
    winnerIds: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

giveawaySchema.index({ ended: 1, endsAt: 1 });

module.exports = model('Giveaway', giveawaySchema);
