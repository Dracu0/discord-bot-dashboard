const { Schema, model } = require('mongoose');

const auditLogSchema = new Schema({
    guildId: { type: String, required: true },
    actorId: { type: String, required: true },
    actorTag: { type: String, default: '' },
    source: { type: String, enum: ['bot', 'dashboard'], required: true },
    category: { type: String, required: true },
    action: { type: String, required: true },
    target: { type: String, default: '' },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now },
});

auditLogSchema.index({ guildId: 1, createdAt: -1 });
auditLogSchema.index({ guildId: 1, category: 1, createdAt: -1 });
auditLogSchema.index({ guildId: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ guildId: 1, actorId: 1, createdAt: -1 });

module.exports = model('AuditLog', auditLogSchema);
