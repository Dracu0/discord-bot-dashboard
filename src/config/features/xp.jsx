import { Locale } from "../../utils/Language";

export const XPFeature = {
    name: {
        en: "XP & Leveling",
    },
    canToggle: true,
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
                ]),                validate: (v) => {
                    if (Array.isArray(v) && v.length > 20) return "Maximum 20 level role rewards";
                },            },
            {
                id: "xpChannelMultipliers",
                name: "Channel XP Multipliers",
                description:
                    "Set XP multipliers per channel. A multiplier of 2 doubles XP earned; 0.5 halves it. Format: channel ID → multiplier (max 25)",
                type: "array",
                element: {
                    type: "pair",
                    holder: "",
                },
                value: (values.xpChannelMultipliers || []).map((m) => [
                    m.targetId,
                    m.multiplier,
                ]),                validate: (v) => {
                    if (Array.isArray(v) && v.length > 25) return "Maximum 25 channel multipliers";
                },            },
            {
                id: "xpRoleMultipliers",
                name: "Role XP Multipliers",
                description:
                    "Set XP multipliers per role. Members with the role get boosted/reduced XP. Format: role ID → multiplier (max 25)",
                type: "array",
                element: {
                    type: "pair",
                    holder: "",
                },
                value: (values.xpRoleMultipliers || []).map((m) => [
                    m.targetId,
                    m.multiplier,
                ]),                validate: (v) => {
                    if (Array.isArray(v) && v.length > 25) return "Maximum 25 role multipliers";
                },            },
        ];
    },
};
