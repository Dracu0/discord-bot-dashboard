const { Schema, model } = require('mongoose');

const customCommandSchema = new Schema({
    guildId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 32 },
    response: { type: String, required: true, maxlength: 2000 },
    description: { type: String, default: '', maxlength: 100 },
    ephemeral: { type: Boolean, default: false },
    createdBy: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

customCommandSchema.index({ guildId: 1, name: 1 }, { unique: true });

module.exports = model('CustomCommand', customCommandSchema);
