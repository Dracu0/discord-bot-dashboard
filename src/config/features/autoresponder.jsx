import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";
import GuildAssetsPicker from "../../components/fields/impl/GuildAssetsPicker";

function appendResponseToken(existing, token) {
    const current = String(existing || "");
    const spacer = current.length > 0 && !/\s$/.test(current) ? " " : "";
    return `${current}${spacer}${token}`;
}

function normalizeResponses(listLike, fallback = "") {
    if (!Array.isArray(listLike)) {
        const single = String(fallback || "").trim();
        return single ? [single] : [];
    }

    const list = listLike
        .map((line) => String(line || "").trim())
        .filter(Boolean)
        .slice(0, 20)
        .map((line) => line.slice(0, 2000));

    if (list.length > 0) return list;
    const single = String(fallback || "").trim();
    return single ? [single] : [];
}

function transformSubmit(data) {
    const randomize = !!data.randomizeResponses;
    const responses = randomize
        ? normalizeResponses(data.responses, data.response)
        : normalizeResponses([], data.response);

    return {
        ...data,
        response: responses[0] || "",
        responses,
        randomizeResponses: randomize,
    };
}

function ResponseEditor({ values, setValue, disabled }) {
    const randomize = !!values.randomizeResponses;
    const currentResponse = String(values.response || "");
    const responses = normalizeResponses(values.responses, currentResponse);

    if (!randomize) {
        return (
            <textarea
                className="w-full min-h-28 rounded-xl border border-(--border-subtle) bg-(--surface-primary) px-3 py-2 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                placeholder="Hey there! Welcome to the server."
                value={currentResponse}
                disabled={disabled}
                onFocus={() => setValue("_activeResponseIndex", 0)}
                onChange={(e) => {
                    const value = String(e.target.value || "").slice(0, 2000);
                    setValue("response", value);
                    setValue("responses", value.trim() ? [value.trim()] : []);
                }}
            />
        );
    }

    const list = responses.length > 0 ? responses : [""];

    const setList = (next) => {
        const capped = next.slice(0, 20).map((v) => String(v || "").slice(0, 2000));
        const normalized = normalizeResponses(capped);
        setValue("responses", capped);
        setValue("response", normalized[0] || "");

        const currentIndex = Number(values._activeResponseIndex);
        const safeIndex = Number.isInteger(currentIndex) ? currentIndex : 0;
        const maxIndex = Math.max(0, capped.length - 1);
        setValue("_activeResponseIndex", Math.min(Math.max(safeIndex, 0), maxIndex));
    };

    return (
        <div className="space-y-2.5">
            {list.map((entry, index) => (
                <div key={`response-${index}`} className="rounded-xl border border-(--border-subtle) bg-(--surface-primary) p-2.5">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                            Response {index + 1}
                        </span>
                        <button
                            type="button"
                            className="text-xs text-(--status-error) disabled:opacity-50"
                            disabled={disabled || list.length <= 1}
                            onClick={() => setList(list.filter((_, i) => i !== index))}
                        >
                            Remove
                        </button>
                    </div>
                    <textarea
                        className="w-full min-h-20 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-2 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                        value={entry}
                        disabled={disabled}
                        onFocus={() => setValue("_activeResponseIndex", index)}
                        onChange={(e) => {
                            const next = [...list];
                            next[index] = String(e.target.value || "").slice(0, 2000);
                            setList(next);
                        }}
                    />
                </div>
            ))}

            <button
                type="button"
                className="text-sm font-medium text-(--accent-primary) disabled:opacity-50"
                disabled={disabled || list.length >= 20}
                onClick={() => setList([...list, ""])}
            >
                + Add response ({list.length}/20)
            </button>
        </div>
    );
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
        id: "_responseEditor",
        label: "Response Text",
        type: "custom",
        description: "Single response when randomize is off. Dynamic response list (up to 20 fields) when randomize is on.",
        render: ({ values, setValue, disabled }) => (
            <ResponseEditor values={values} setValue={setValue} disabled={disabled} />
        ),
    },
    {
        id: "_guildAssetsPicker",
        label: "Guild Assets",
        type: "custom",
        description: "Insert server emojis/stickers directly into the response.",
        render: ({ values, setValue, disabled }) => (
            <GuildAssetsPicker
                disabled={disabled}
                onInsert={(token) => {
                    if (values.randomizeResponses) {
                        const currentList = normalizeResponses(values.responses, values.response);
                        const next = currentList.length > 0 ? [...currentList] : [""];
                        const requestedIndex = Number(values._activeResponseIndex);
                        const activeIndex = Number.isInteger(requestedIndex) ? requestedIndex : 0;
                        const targetIndex = Math.min(Math.max(activeIndex, 0), next.length - 1);
                        next[targetIndex] = appendResponseToken(next[targetIndex], token);
                        setValue("responses", next);
                        setValue("response", next[0] || "");
                        setValue("_activeResponseIndex", targetIndex);
                        return;
                    }

                    const nextResponse = appendResponseToken(values.response, token);
                    setValue("response", nextResponse);
                    setValue("responses", nextResponse.trim() ? [nextResponse.trim()] : []);
                }}
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
            responses: normalizeResponses(item.responses, item.response),
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
