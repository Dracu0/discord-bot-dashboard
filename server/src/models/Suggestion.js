const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto');

const suggestionSchema = new Schema({
    suggestionId: {
        type: String,
        default: randomUUID,
    },
    authorId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 4000,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'in-progress'],
        default: 'pending',
    },
    reason: {
        type: String,
        default: '',
        maxlength: 2000,
    },
    upvotes: {
        type: [String],
        default: [],
    },
    downvotes: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

suggestionSchema.index({ guildId: 1 });
suggestionSchema.index({ guildId: 1, authorId: 1 });
suggestionSchema.index({ suggestionId: 1 }, { unique: true });

module.exports = model('Suggestion', suggestionSchema);
