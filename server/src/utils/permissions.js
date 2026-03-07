const MANAGE_GUILD = BigInt(0x20);
const ADMINISTRATOR = BigInt(0x8);

/**
 * Check if a permissions bitfield includes MANAGE_GUILD or ADMINISTRATOR.
 * @param {string|number|bigint} permissions - Discord permission bitfield
 * @returns {boolean}
 */
function hasManageGuild(permissions) {
    const perms = BigInt(permissions);
    return (perms & MANAGE_GUILD) !== BigInt(0) || (perms & ADMINISTRATOR) !== BigInt(0);
}

module.exports = { hasManageGuild, MANAGE_GUILD, ADMINISTRATOR };
