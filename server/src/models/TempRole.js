const { Schema, model } = require('mongoose');

const tempRoleSchema = new Schema({
    guildId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    roleId: { type: String, required: true },
    assignedBy: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

tempRoleSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 }); // 7-day TTL safety net (matches bot)
tempRoleSchema.index({ guildId: 1, userId: 1, roleId: 1 }, { unique: true });

module.exports = model('TempRole', tempRoleSchema);
