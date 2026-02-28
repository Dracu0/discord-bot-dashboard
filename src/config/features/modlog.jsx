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
            {
                id: "warnThresholds",
                name: "Warning Thresholds",
                description:
                    "Auto-escalation rules. When a member reaches X warnings, automatically apply an action (timeout/kick/ban). Format: warn count → action (max 10)",
                type: "array",
                element: {
                    type: "pair",
                    holder: "",
                },
                value: (values.warnThresholds || []).map((t) => [
                    t.count,
                    `${t.action}${t.duration ? `:${t.duration}` : ""}`,
                ]),
            },
        ];
    },
};
