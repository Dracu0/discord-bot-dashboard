const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

/**
 * Fetch guild info via the Discord Bot API
 */
async function fetchGuild(guildId) {
    return rest.get(Routes.guild(guildId), {
        query: new URLSearchParams({ with_counts: 'true' }),
    });
}

/**
 * Fetch guild channels via the Discord Bot API
 */
async function fetchGuildChannels(guildId) {
    return rest.get(Routes.guildChannels(guildId));
}

/**
 * Fetch guild roles via the Discord Bot API
 */
async function fetchGuildRoles(guildId) {
    return rest.get(Routes.guildRoles(guildId));
}

/**
 * Fetch all guild IDs the bot is in (paginated, single/few API calls instead of N).
 */
async function fetchBotGuildIds() {
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
    return ids;
}

/**
 * Fetch guild member via the Discord Bot API
 */
async function fetchGuildMember(guildId, userId) {
    return rest.get(Routes.guildMember(guildId, userId));
}

/**
 * Fetch guild members (up to 1000)
 */
async function fetchGuildMembers(guildId, limit = 100) {
    return rest.get(Routes.guildMembers(guildId), {
        query: new URLSearchParams({ limit: String(limit) }),
    });
}

module.exports = {
    fetchGuild,
    fetchBotGuildIds,
    fetchGuildChannels,
    fetchGuildRoles,
    fetchGuildMember,
    fetchGuildMembers,
};
