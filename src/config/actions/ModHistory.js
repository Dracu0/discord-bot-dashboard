import { Locale } from "utils/Language";

const ACTION_TYPES = [
    { label: "Warn", value: "warn" },
    { label: "Kick", value: "kick" },
    { label: "Ban", value: "ban" },
    { label: "Unban", value: "unban" },
    { label: "Timeout", value: "timeout" },
    { label: "Untimeout", value: "untimeout" },
];

export const ModHistoryAction = {
    name: {
        en: "Moderation History",
    },
    description: (
        <Locale
            en="View moderation action history — warns, kicks, bans, timeouts, and other logged moderator actions."
        />
    ),
    options: (values) => [
        {
            id: "action",
            name: "Action Type",
            description: "The type of moderation action",
            type: "enum",
            choices: ACTION_TYPES,
            value: values ? values.action : "",
        },
        {
            id: "targetId",
            name: "Target User",
            description: "The user ID of the target",
            type: "string",
            value: values ? values.targetId : "",
        },
        {
            id: "moderatorId",
            name: "Moderator",
            description: "The user ID of the moderator",
            type: "string",
            value: values ? values.moderatorId : "",
        },
        {
            id: "reason",
            name: "Reason",
            description: "Reason for the action",
            type: "string",
            value: values ? values.reason : "",
        },
        {
            id: "duration",
            name: "Duration (seconds)",
            description: "Duration of the action (for timeouts)",
            type: "number",
            value: values ? values.duration : 0,
        },
    ],
};
