import { Locale } from "utils/Language";

const ACTION_TYPES = [
    { label: "All", value: "" },
    { label: "Warn", value: "warn" },
    { label: "Kick", value: "kick" },
    { label: "Ban", value: "ban" },
    { label: "Unban", value: "unban" },
    { label: "Timeout", value: "timeout" },
    { label: "Untimeout", value: "untimeout" },
];

const ACTION_COLORS = {
    warn: "#FFCC00",
    kick: "#FF6600",
    ban: "#FF0000",
    unban: "#00CC66",
    timeout: "#FF9900",
    untimeout: "#66CCFF",
};

const ACTION_LABELS = {
    warn: "Warning",
    kick: "Kick",
    ban: "Ban",
    unban: "Unban",
    timeout: "Timeout",
    untimeout: "Untimeout",
};

export { ACTION_TYPES, ACTION_COLORS, ACTION_LABELS };

export const ModHistoryAction = {
    name: {
        en: "Moderation History",
    },
    description: (
        <Locale
            en="View moderation action history — warns, kicks, bans, timeouts, and other logged moderator actions."
        />
    ),
    readOnly: true,
    filterOptions: ACTION_TYPES,
    options: (values) => [
        {
            id: "action",
            name: "Action Type",
            description: "The type of moderation action",
            type: "enum",
            choices: ACTION_TYPES.filter(t => t.value),
            value: values ? values.action : "",
            readOnly: true,
        },
        {
            id: "targetId",
            name: "Target User ID",
            description: "The Discord user ID of the member this action was applied to",
            type: "string",
            value: values ? values.targetId : "",
            readOnly: true,
        },
        {
            id: "moderatorId",
            name: "Moderator ID",
            description: "The Discord user ID of the moderator who performed this action",
            type: "string",
            value: values ? values.moderatorId : "",
            readOnly: true,
        },
        {
            id: "reason",
            name: "Reason",
            description: "Reason for the moderation action",
            type: "string",
            value: values ? values.reason : "",
        },
        {
            id: "duration",
            name: "Duration (seconds)",
            description: "How long the action lasts (for timeouts)",
            type: "number",
            value: values ? values.duration : 0,
            readOnly: true,
        },
    ],
};
