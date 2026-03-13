const { REST, Routes } = require('discord.js');
const logger = require('./logger');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

// Cache for bot guild IDs — refreshed every 5 minutes
let botGuildIdsCache = null;
let botGuildIdsCacheTime = 0;
const BOT_GUILD_CACHE_TTL = 5 * 60 * 1000;

/**
 * Fetch guild info via the Discord Bot API
 */
async function fetchGuild(guildId) {
    try {
        return await rest.get(Routes.guild(guildId), {
            query: new URLSearchParams({ with_counts: 'true' }),
        });
    } catch (err) {
        logger.error('discord_api_fetch_guild_failed', { guildId, error: err.message, status: err.status });
        throw err;
    }
}

/**
 * Fetch guild channels via the Discord Bot API
 */
async function fetchGuildChannels(guildId) {
    try {
        return await rest.get(Routes.guildChannels(guildId));
    } catch (err) {
        logger.error('discord_api_fetch_channels_failed', { guildId, error: err.message, status: err.status });
        return [];
    }
}

/**
 * Fetch guild roles via the Discord Bot API
 */
async function fetchGuildRoles(guildId) {
    try {
        return await rest.get(Routes.guildRoles(guildId));
    } catch (err) {
        logger.error('discord_api_fetch_roles_failed', { guildId, error: err.message, status: err.status });
        return [];
    }
}

/**
 * Fetch guild custom emojis via the Discord Bot API
 */
async function fetchGuildEmojis(guildId) {
    try {
        return await rest.get(Routes.guildEmojis(guildId));
    } catch (err) {
        logger.error('discord_api_fetch_emojis_failed', { guildId, error: err.message, status: err.status });
        return [];
    }
}

/**
 * Fetch guild stickers via the Discord Bot API
 */
async function fetchGuildStickers(guildId) {
    try {
        return await rest.get(Routes.guildStickers(guildId));
    } catch (err) {
        logger.error('discord_api_fetch_stickers_failed', { guildId, error: err.message, status: err.status });
        return [];
    }
}

/**
 * Fetch all guild IDs the bot is in (paginated), with 5-minute cache.
 */
async function fetchBotGuildIds() {
    const now = Date.now();
    if (botGuildIdsCache && (now - botGuildIdsCacheTime) < BOT_GUILD_CACHE_TTL) {
        return botGuildIdsCache;
    }

    try {
        const ids = new Set();
        let after = '0';
        while (true) {
            const batch = await rest.get(Routes.userGuilds(), {
                query: new URLSearchParams({ limit: '200', after }),
            });
            for (const g of batch) ids.add(g.id);
            if (batch.length < 200) break;
            after = batch[batch.length - 1].id;
        }
        botGuildIdsCache = ids;
        botGuildIdsCacheTime = now;
        return ids;
    } catch (err) {
        logger.error('discord_api_fetch_bot_guilds_failed', { error: err.message });
        // Return stale cache if available, otherwise empty set
        return botGuildIdsCache || new Set();
    }
}

/**
 * Fetch guild member via the Discord Bot API
 */
async function fetchGuildMember(guildId, userId) {
    try {
        return await rest.get(Routes.guildMember(guildId, userId));
    } catch (err) {
        logger.error('discord_api_fetch_member_failed', { guildId, userId, error: err.message, status: err.status });
        return null;
    }
}

/**
 * Fetch guild members (up to 1000)
 */
async function fetchGuildMembers(guildId, limit = 100) {
    try {
        return await rest.get(Routes.guildMembers(guildId), {
            query: new URLSearchParams({ limit: String(limit) }),
        });
    } catch (err) {
        logger.error('discord_api_fetch_members_failed', { guildId, error: err.message, status: err.status });
        return [];
    }
}

/**
 * Add a role to a guild member
 */
async function addGuildMemberRole(guildId, userId, roleId, reason) {
    try {
        await rest.put(Routes.guildMemberRole(guildId, userId, roleId), {
            reason: reason || 'Dashboard: temporary role assigned',
        });
        return true;
    } catch (err) {
        logger.error('discord_api_add_role_failed', { guildId, userId, roleId, error: err.message, status: err.status });
        throw err;
    }
}

/**
 * Remove a role from a guild member
 */
async function removeGuildMemberRole(guildId, userId, roleId, reason) {
    try {
        await rest.delete(Routes.guildMemberRole(guildId, userId, roleId), {
            reason: reason || 'Dashboard: temporary role removed',
        });
        return true;
    } catch (err) {
        logger.error('discord_api_remove_role_failed', { guildId, userId, roleId, error: err.message, status: err.status });
        throw err;
    }
}

/**
 * Send a message to a channel
 */
async function sendChannelMessage(channelId, body) {
    try {
        return await rest.post(Routes.channelMessages(channelId), { body });
    } catch (err) {
        logger.error('discord_api_send_message_failed', { channelId, error: err.message, status: err.status });
        throw err;
    }
}

/**
 * Add a reaction to a message
 */
async function addMessageReaction(channelId, messageId, emoji) {
    try {
        await rest.put(Routes.channelMessageOwnReaction(channelId, messageId, encodeURIComponent(emoji)));
        return true;
    } catch (err) {
        logger.error('discord_api_add_reaction_failed', { channelId, messageId, emoji, error: err.message, status: err.status });
        throw err;
    }
}

module.exports = {
    fetchGuild,
    fetchBotGuildIds,
    fetchGuildChannels,
    fetchGuildRoles,
    fetchGuildEmojis,
    fetchGuildStickers,
    fetchGuildMember,
    fetchGuildMembers,
    addGuildMemberRole,
    removeGuildMemberRole,
    sendChannelMessage,
    addMessageReaction,
};
