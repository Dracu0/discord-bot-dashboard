import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";
import GuildAssetsPicker from "../../components/fields/impl/GuildAssetsPicker";

function appendResponseToken(existing, token) {
    const current = String(existing || "");
    const spacer = current.length > 0 && !/\s$/.test(current) ? " " : "";
    return `${current}${spacer}${token}`;
}

function toResponseListText(item) {
    const list = Array.isArray(item?.responses) && item.responses.length
        ? item.responses
        : (item?.response ? [item.response] : []);
    return list.join("\n");
}

function transformSubmit(data) {
    const responseListText = String(data.responsesText || "");
    const responses = responseListText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 20)
        .map((line) => line.slice(0, 2000));

    return {
        ...data,
        response: responses[0] || "",
        responses,
        randomizeResponses: !!data.randomizeResponses,
    };
}

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
    {
        key: "responses",
        label: "Responses",
        render: (_v, item) => {
            const list = Array.isArray(item?.responses) && item.responses.length
                ? item.responses
                : (item?.response ? [item.response] : []);
            return String(list.length || 0);
        },
    },
    {
        key: "randomizeResponses",
        label: "Random",
        render: (v) => (v ? "Yes" : "No"),
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
        id: "responsesText",
        label: "Responses (one per line)",
        type: "long_string",
        required: true,
        placeholder: "Hey there! Welcome to the server.",
        description: "Each non-empty line is one possible response (max 20 lines). Supports custom emoji mentions, GIF URLs, and {{sticker:ID}} tokens.",
        validate: (v) => {
            const lines = String(v || "")
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean);
            if (lines.length === 0) return "At least one response is required";
            if (lines.length > 20) return "Maximum 20 responses";
            if (lines.some((line) => line.length > 2000)) return "Each response line must be 2000 chars or less";
        },
    },
    {
        id: "_guildAssetsPicker",
        label: "Guild Assets",
        type: "custom",
        description: "Insert server emojis/stickers directly into the response.",
        render: ({ values, setValue, disabled }) => (
            <GuildAssetsPicker
                disabled={disabled}
                onInsert={(token) => setValue("responsesText", appendResponseToken(values.responsesText, token))}
            />
        ),
    },
    {
        id: "randomizeResponses",
        label: "Randomize responses",
        type: "boolean",
        defaultValue: false,
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
        const responders = (values?.autoResponders || []).map((item) => ({
            ...item,
            responsesText: toResponseListText(item),
        }));

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
                        transformSubmit={transformSubmit}
                    />
                ),
            },
        ];
    },
};
