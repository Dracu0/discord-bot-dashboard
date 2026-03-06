import { Locale } from "../../utils/Language";
import { OptionTypes } from "../../variables/type";

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
                name: "Suggestion Cooldown",
                description:
                    "Choose how long each user must wait before submitting another suggestion.",
                type: OptionTypes.Duration,
                duration: {
                    baseUnit: "milliseconds",
                    units: ["seconds", "minutes", "hours", "days"],
                    min: 0,
                    max: 24 * 60 * 60 * 1000,
                    zeroLabel: "No cooldown",
                },
                value: values.suggestionCooldownMs ?? 5 * 60 * 1000,
                validate: (v) => {
                    if (v < 0) return "Cooldown cannot be negative";
                    if (v > 24 * 60 * 60 * 1000) return "Maximum cooldown is 24 hours";
                    if (!Number.isFinite(v)) return "Must be a valid number";
                },
            },
        ];
    },
};
