import { Locale } from "../../utils/Language";

export const AutoModFeature = {
    name: {
        en: "Auto-Moderation",
    },
    canToggle: true,
    description: (
        <Locale
            en="Automatic message filtering — banned words, Discord invite blocking, link blocking, and anti-spam protection with configurable actions. Note: Members with Manage Messages permission bypass auto-mod."
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
                id: "automodBlockInvites",
                name: "Block Discord Invites",
                description: "Automatically delete messages containing Discord invite links",
                type: "boolean",
                value: values.automodBlockInvites ?? false,
            },
            {
                id: "automodBlockLinks",
                name: "Block External Links",
                description: "Automatically delete messages containing links not in the allowed domains list",
                type: "boolean",
                value: values.automodBlockLinks ?? false,
            },
            {
                id: "automodAllowedLinkDomains",
                name: "Allowed Link Domains",
                description: "Domains that bypass the link filter (e.g. youtube.com, github.com). Max 50.",
                type: "array",
                element: { type: "string", holder: "example.com" },
                value: values.automodAllowedLinkDomains || [],
                validate: (v) => {
                    if (Array.isArray(v) && v.length > 50) return "Maximum 50 domains allowed";
                },
            },
            {
                id: "automodBannedWords",
                name: "Banned Words",
                description: "Words or phrases to filter out of messages. Case-insensitive matching. Max 200.",
                type: "array",
                element: { type: "string", holder: "bad word" },
                value: values.automodBannedWords || [],
                validate: (v) => {
                    if (Array.isArray(v) && v.length > 200) return "Maximum 200 banned words allowed";
                },
            },
            {
                id: "automodAntiSpamEnabled",
                name: "Anti-Spam",
                description: "Detect and punish message spamming",
                type: "boolean",
                value: values.automodAntiSpamEnabled ?? false,
            },
            {
                id: "automodAntiSpamMaxMessages",
                name: "Spam Threshold (messages)",
                description: "Number of messages within the interval that triggers spam detection (default: 5)",
                type: "number",
                value: values.automodAntiSpamMaxMessages ?? 5,
                validate: (v) => {
                    if (!Number.isInteger(v) || v < 2) return "Must be at least 2 messages";
                    if (v > 100) return "Maximum is 100 messages";
                },
            },
            {
                id: "automodAntiSpamInterval",
                name: "Spam Interval (ms)",
                description: "Time window in milliseconds for spam detection (default: 5000 = 5 seconds)",
                type: "number",
                value: values.automodAntiSpamInterval ?? 5000,
                validate: (v) => {
                    if (v < 1000) return "Minimum interval is 1000ms (1 second)";
                    if (v > 60000) return "Maximum interval is 60000ms (60 seconds)";
                },
            },
            {
                id: "automodAction",
                name: "Violation Action",
                description: "Action to take when auto-mod is triggered (delete only, warn, or timeout)",
                type: "enum",
                choices: ["delete", "warn", "timeout"],
                value: values.automodAction || "delete",
            },
            {
                id: "automodTimeoutDuration",
                name: "Timeout Duration (ms)",
                description: "Duration of timeout when action is 'timeout' (default: 60000 = 1 minute)",
                type: "number",
                value: values.automodTimeoutDuration ?? 60000,
                validate: (v) => {
                    if (v < 5000) return "Minimum timeout is 5000ms (5 seconds)";
                    if (v > 2419200000) return "Maximum timeout is 28 days";
                },
            },
            {
                id: "automodExemptRoleIds",
                name: "Exempt Roles",
                description: "Roles that bypass auto-moderation filters",
                type: "id_enum",
                choices: roleChoices,
                element: { type: "role" },
                multiple: true,
                value: values.automodExemptRoleIds || [],
            },
            {
                id: "automodExemptChannelIds",
                name: "Exempt Channels",
                description: "Channels where auto-moderation is disabled",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                multiple: true,
                value: values.automodExemptChannelIds || [],
            },
            {
                id: "automodLogChannelId",
                name: "Auto-Mod Log Channel",
                description: "Channel where auto-mod actions are logged",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                value: values.automodLogChannelId || "",
            },
        ];
    },
};
