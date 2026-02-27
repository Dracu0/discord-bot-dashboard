// Shared validation helpers for guild routes

const VALID_SUGGESTION_STATUSES = ['pending', 'approved', 'rejected', 'in-progress'];

function isValidObjectId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

function isObject(val) {
    return val != null && typeof val === 'object' && !Array.isArray(val);
}

function colorToHex(value, fallback = '#000000') {
    if (value == null) return fallback;
    return `#${value.toString(16).padStart(6, '0')}`;
}

module.exports = {
    VALID_SUGGESTION_STATUSES,
    isValidObjectId,
    isObject,
    colorToHex,
};
