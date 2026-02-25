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
                name: "Suggestion Cooldown (ms)",
                description:
                    "Cooldown between suggestions per user in milliseconds (0 = no cooldown, max 86400000 = 24 hours)",
                type: "number",
                value: values.suggestionCooldownMs ?? 0,
            },
        ];
    },
};
