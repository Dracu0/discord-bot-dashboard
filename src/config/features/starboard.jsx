import { Locale } from "../../utils/Language";

export const StarboardFeature = {
    name: {
        en: "Starboard",
    },
    canToggle: true,
    description: (
        <Locale
            en="Highlight popular messages — when a message receives enough star reactions, it's automatically reposted to a designated starboard channel."
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
                id: "starboardChannelId",
                name: "Starboard Channel",
                description: "Channel where starred messages are reposted",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                value: values.starboardChannelId || "",
            },
            {
                id: "starboardThreshold",
                name: "Star Threshold",
                description: "Minimum number of star reactions needed to post to the starboard (default: 3)",
                type: "number",
                value: values.starboardThreshold ?? 3,
                validate: (v) => {
                    if (!Number.isInteger(v) || v < 1) return "Threshold must be at least 1";
                    if (v > 100) return "Maximum threshold is 100";
                },
            },
            {
                id: "starboardEmoji",
                name: "Starboard Emoji",
                description: "Emoji used for starboard reactions (default: ⭐)",
                type: "string",
                value: values.starboardEmoji || "⭐",
            },
        ];
    },
};
