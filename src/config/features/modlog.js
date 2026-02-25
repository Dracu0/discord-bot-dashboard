import { Locale } from "../../utils/Language";

export const ModLogFeature = {
    name: {
        en: "Moderation Log",
    },
    description: (
        <Locale
            en="Configure the moderation log — set the channel where mod actions (bans, timeouts, role changes, message edits/deletes) are logged."
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
                id: "modLogChannelId",
                name: "Mod Log Channel",
                description:
                    "Channel where moderation actions are logged automatically",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                value: values.modLogChannelId || "",
            },
        ];
    },
};
