import { Locale } from "../../utils/Language";

export const XPFeature = {
    name: {
        en: "XP & Leveling",
    },
    description: (
        <Locale
            en="Configure the XP leveling system — ignored channels, level-up notifications, and role rewards for reaching specific levels."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || []).map((ch) => ({
            id: ch.id,
            name: `#${ch.name}`,
            icon: "channel",
        }));

        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
            color: r.color,
            icon: "role",
        }));

        return [
            {
                id: "xpDisableLevelUpMessages",
                name: "Disable Level-Up Messages",
                description:
                    "When enabled, the bot will not send level-up messages",
                type: "boolean",
                value: values.xpDisableLevelUpMessages ?? false,
            },
            {
                id: "xpLevelUpChannelId",
                name: "Level-Up Channel",
                description:
                    "Channel where level-up messages are sent. If empty, messages are sent in the same channel.",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                value: values.xpLevelUpChannelId || "",
            },
            {
                id: "xpIgnoredChannelIds",
                name: "Ignored Channels",
                description:
                    "Messages in these channels will not earn XP",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                multiple: true,
                value: values.xpIgnoredChannelIds || [],
            },
            {
                id: "levelRoles",
                name: "Level Role Rewards",
                description:
                    "Roles awarded when members reach specific levels (max 20). Format: level → role",
                type: "array",
                element: {
                    type: "pair",
                    holder: "",
                },
                value: (values.levelRoles || []).map((lr) => [
                    lr.level,
                    lr.roleId,
                ]),
            },
        ];
    },
};
