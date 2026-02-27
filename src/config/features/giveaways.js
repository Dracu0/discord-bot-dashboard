import { Locale } from "../../utils/Language";

export const GiveawaysFeature = {
    name: {
        en: "Giveaways",
    },
    description: (
        <Locale
            en="Run reaction-based giveaways with automatic winner selection. Use /giveaway in Discord to start, end, reroll, or list giveaways."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || []).map((ch) => ({
            id: ch.id,
            name: `#${ch.name}`,
        }));

        const active = (values.giveaways || []).filter((g) => !g.ended);
        const ended = (values.giveaways || []).filter((g) => g.ended).slice(0, 5);

        const activeLines = active.map((g) => {
            const channelName = channelChoices.find((c) => c.id === g.channelId)?.name || g.channelId;
            const endsAt = g.endsAt ? new Date(g.endsAt).toLocaleString() : "Unknown";
            return `🎉 **${g.prize}** — ${channelName} — ends ${endsAt}`;
        });

        const endedLines = ended.map((g) => {
            const winners = (g.winnerIds || []).map((id) => `<@${id}>`).join(", ") || "No winners";
            return `✅ **${g.prize}** — ${winners}`;
        });

        const options = [];

        options.push({
            id: "_activeGiveaways",
            name: "Active Giveaways",
            description: activeLines.length > 0
                ? activeLines.join("\n")
                : "No active giveaways. Use `/giveaway start` in Discord to create one.",
            type: "boolean",
            value: activeLines.length > 0,
        });

        if (endedLines.length > 0) {
            options.push({
                id: "_recentGiveaways",
                name: "Recent Giveaways",
                description: endedLines.join("\n"),
                type: "boolean",
                value: true,
            });
        }

        return options;
    },
};
