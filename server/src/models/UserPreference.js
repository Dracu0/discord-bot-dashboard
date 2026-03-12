const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    colorScheme: { type: String, enum: ['light', 'dark', 'auto', 'system'], default: 'system' },
    accentColor: { type: String, default: 'brand' },
    language: { type: String, enum: ['en'], default: 'en' },
    sidebarCollapsed: { type: Boolean, default: false },
}, {
    timestamps: true,
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
