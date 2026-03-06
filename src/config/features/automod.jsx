import { Locale } from "../../utils/Language";
import { OptionTypes } from "../../variables/type";

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
                name: "Spam Detection Window",
                description: "Choose how much time counts as one spam burst when checking repeated messages.",
                type: OptionTypes.Duration,
                duration: {
                    baseUnit: "milliseconds",
                    units: ["seconds", "minutes"],
                    min: 1000,
                    max: 60000,
                    zeroLabel: "Disabled",
                },
                value: values.automodAntiSpamInterval ?? 5000,
                validate: (v) => {
                    if (v < 1000) return "Minimum interval is 1 second";
                    if (v > 60000) return "Maximum interval is 1 minute";
                },
            },
            {
                id: "automodAction",
                name: "Violation Action",
                description: "Delete: remove message silently · Warn: keep message and reply with a visible warning · Timeout: remove message and timeout the user",
                type: "enum",
                choices: ["delete", "warn", "timeout"],
                value: values.automodAction || "delete",
            },
            {
                id: "automodTimeoutDuration",
                name: "Timeout Length",
                description: "Choose how long members should be timed out when the auto-mod action is set to timeout.",
                type: OptionTypes.Duration,
                duration: {
                    baseUnit: "milliseconds",
                    units: ["seconds", "minutes", "hours", "days"],
                    min: 5000,
                    max: 28 * 24 * 60 * 60 * 1000,
                },
                value: values.automodTimeoutDuration ?? 10 * 60 * 1000,
                validate: (v) => {
                    if (v < 5000) return "Minimum timeout is 5 seconds";
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
