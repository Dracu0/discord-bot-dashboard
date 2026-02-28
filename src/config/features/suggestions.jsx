import { Locale } from "../../utils/Language";

export const SuggestionsFeature = {
    name: {
        en: "Suggestions",
    },
    description: (
        <Locale
            en="Configure the suggestion system — set channels where members can submit suggestions, and adjust cooldown timers."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || []).map((ch) => ({
            id: ch.id,
            name: `#${ch.name}`,
            icon: "channel",
        }));

        return [
            {
                id: "suggestionChannelIds",
                name: "Suggestion Channels",
                description:
                    "Channels where the /suggest command is enabled",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                multiple: true,
                value: values.suggestionChannelIds || [],
            },
            {
                id: "suggestionCooldownMs",
                name: "Suggestion Cooldown (s)",
                description:
                    "Cooldown between suggestions per user in seconds (0 = no cooldown, max 86400 = 24 hours)",
                type: "number",
                value: (values.suggestionCooldownMs ?? 0) / 1000,
                validate: (v) => {
                    if (v < 0) return "Cooldown cannot be negative";
                    if (v > 86400) return "Maximum cooldown is 86400 seconds (24 hours)";
                    if (!Number.isFinite(v)) return "Must be a valid number";
                },
            },
        ];
    },
};
