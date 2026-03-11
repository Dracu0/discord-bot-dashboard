import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";

const columns = [
    {
        key: "name",
        label: "Name",
        render: (v) => v,
    },
    {
        key: "trigger",
        label: "Trigger",
        render: (v) => (v?.length > 40 ? v.slice(0, 40) + "…" : v),
    },
    {
        key: "matchMode",
        label: "Match",
        render: (v) => v || "contains",
    },
    {
        key: "enabled",
        label: "Enabled",
        render: (v) => (v !== false ? "Yes" : "No"),
    },
];

const formFields = [
    {
        id: "name",
        label: "Name",
        type: "string",
        required: true,
        placeholder: "greet",
        description:
            "Unique identifier for this auto-responder (max 32 chars).",
        immutable: true,
        validate: (v) => {
            if (v && v.length > 32) return "Max 32 characters";
        },
    },
    {
        id: "trigger",
        label: "Trigger Text",
        type: "string",
        required: true,
        placeholder: "hello",
        description: "The text that triggers this response (max 200 chars).",
        validate: (v) => {
            if (v && v.length > 200) return "Max 200 characters";
        },
    },
    {
        id: "matchMode",
        label: "Match Mode",
        type: "enum",
        choices: [
            { value: "contains", label: "Contains" },
            { value: "exact", label: "Exact Match" },
            { value: "startsWith", label: "Starts With" },
            { value: "regex", label: "Regex" },
        ],
        defaultValue: "contains",
        description:
            "How the trigger text is matched against messages.",
    },
    {
        id: "response",
        label: "Response Text",
        type: "long_string",
        required: true,
        placeholder: "Hey there! Welcome to the server.",
        description: "The message the bot replies with (max 2000 chars).",
        validate: (v) => {
            if (v && v.length > 2000) return "Max 2000 characters";
        },
    },
    {
        id: "ignoreBots",
        label: "Ignore bot messages",
        type: "boolean",
        defaultValue: true,
    },
    {
        id: "cooldownMs",
        label: "Cooldown (ms)",
        type: "number",
        defaultValue: 5000,
        description:
            "Minimum time between responses for the same trigger (in milliseconds).",
        validate: (v) => {
            if (v != null && (!Number.isInteger(v) || v < 0))
                return "Cooldown must be 0 or more";
            if (v > 300000) return "Maximum cooldown is 5 minutes";
        },
    },
    {
        id: "enabled",
        label: "Enabled",
        type: "boolean",
        defaultValue: true,
    },
];

export const AutoResponderFeature = {
    name: {
        en: "Auto-Responder",
    },
    description: (
        <Locale
            en="Automatically reply to messages matching specific triggers. Supports exact match, contains, starts-with, and regex modes."
        />
    ),
    options: (values) => {
        const responders = values?.autoResponders || [];

        return [
            {
                id: "_autoRespondersManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <ItemManager
                        featureId="auto_responder"
                        items={responders}
                        columns={columns}
                        formFields={formFields}
                        itemLabel="Auto-Responder"
                    />
                ),
            },
        ];
    },
};
