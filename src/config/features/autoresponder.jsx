import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";
import GuildAssetsPicker from "../../components/fields/impl/GuildAssetsPicker";
import Card from "../../components/card/Card";

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

function getEditableResponses(listLike, fallback = "") {
    if (Array.isArray(listLike)) {
        const list = listLike
            .slice(0, 20)
            .map((line) => String(line || "").slice(0, 2000));
        if (list.length > 0) return list;
    }

    const single = String(fallback || "").slice(0, 2000);
    return single ? [single] : [""];
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

function matchModeLabel(mode) {
    switch (mode) {
        case "exact":
            return "Exact";
        case "startsWith":
            return "Starts with";
        case "regex":
            return "Regex";
        default:
            return "Contains";
    }
}

function matchModeClass(mode) {
    if (mode === "regex") {
        return "bg-violet-500/15 text-violet-300 ring-violet-400/30";
    }
    if (mode === "exact") {
        return "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30";
    }
    if (mode === "startsWith") {
        return "bg-sky-500/15 text-sky-300 ring-sky-400/30";
    }
    return "bg-amber-500/15 text-amber-300 ring-amber-400/30";
}

function ResponseEditor({ values, setValue, disabled }) {
    const randomize = !!values.randomizeResponses;
    const currentResponse = String(values.response || "");
    const responses = randomize
        ? getEditableResponses(values.responses, currentResponse)
        : normalizeResponses(values.responses, currentResponse);

    if (!randomize) {
        const trimmed = currentResponse.trim();
        const tokenCount = trimmed ? trimmed.split(/\s+/).length : 0;

        return (
            <div className="rounded-2xl border border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                            Single response mode
                        </p>
                        <p className="text-sm text-(--text-secondary)">
                            One deterministic reply for each trigger match.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-(--text-muted)">
                        <span className="rounded-full border border-(--border-subtle) bg-(--surface-primary) px-2 py-1">
                            {tokenCount} tokens
                        </span>
                        <span className="rounded-full border border-(--border-subtle) bg-(--surface-primary) px-2 py-1">
                            {currentResponse.length}/2000
                        </span>
                    </div>
                </div>

                <textarea
                    className="w-full min-h-32 rounded-xl border border-(--border-subtle) bg-(--surface-primary) px-3 py-2 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
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
            </div>
        );
    }

    const list = responses.length > 0 ? responses : [""];

    const setList = (next) => {
        const capped = next.slice(0, 20).map((v) => String(v || "").slice(0, 2000));
        const firstResolved = normalizeResponses(capped, "")[0] || "";
        setValue("responses", capped);
        setValue("response", firstResolved);

        const currentIndex = Number(values._activeResponseIndex);
        const safeIndex = Number.isInteger(currentIndex) ? currentIndex : 0;
        const maxIndex = Math.max(0, capped.length - 1);
        setValue("_activeResponseIndex", Math.min(Math.max(safeIndex, 0), maxIndex));
    };

    return (
        <div className="space-y-3">
            <div className="rounded-2xl border border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                            Response pool mode
                        </p>
                        <p className="text-sm text-(--text-secondary)">
                            Build a response list. One reply is selected randomly per trigger.
                        </p>
                    </div>
                    <div className="rounded-full border border-(--border-subtle) bg-(--surface-primary) px-2.5 py-1 text-[11px] font-medium text-(--text-muted)">
                        {list.length}/20 configured
                    </div>
                </div>
            </div>

            {list.map((entry, index) => (
                <div
                    key={`response-${index}`}
                    className="rounded-2xl border border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-primary)_0%,var(--surface-card)_100%)] p-3"
                >
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-(--accent-primary) px-2 text-[11px] font-semibold text-white">
                                {index + 1}
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                                Candidate response
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                className="rounded-md border border-(--border-subtle) bg-(--surface-primary) px-2 py-1 text-[11px] text-(--text-secondary) disabled:opacity-40"
                                disabled={disabled || index === 0}
                                onClick={() => {
                                    const next = [...list];
                                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                    setList(next);
                                    setValue("_activeResponseIndex", index - 1);
                                }}
                            >
                                Up
                            </button>
                            <button
                                type="button"
                                className="rounded-md border border-(--border-subtle) bg-(--surface-primary) px-2 py-1 text-[11px] text-(--text-secondary) disabled:opacity-40"
                                disabled={disabled || index === list.length - 1}
                                onClick={() => {
                                    const next = [...list];
                                    [next[index + 1], next[index]] = [next[index], next[index + 1]];
                                    setList(next);
                                    setValue("_activeResponseIndex", index + 1);
                                }}
                            >
                                Down
                            </button>
                            <button
                                type="button"
                                className="rounded-md border border-(--status-error) bg-(--status-error)/10 px-2 py-1 text-[11px] text-(--status-error) disabled:opacity-40"
                                disabled={disabled || list.length <= 1}
                                onClick={() => setList(list.filter((_, i) => i !== index))}
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    <textarea
                        className="w-full min-h-20 rounded-lg border border-(--border-subtle) bg-(--surface-card) px-3 py-2 text-sm text-(--text-primary) focus:border-(--accent-primary) focus:outline-none"
                        value={entry}
                        disabled={disabled}
                        placeholder={`Response ${index + 1} text...`}
                        onFocus={() => setValue("_activeResponseIndex", index)}
                        onChange={(e) => {
                            const next = [...list];
                            next[index] = String(e.target.value || "").slice(0, 2000);
                            setList(next);
                        }}
                    />

                    <div className="mt-1.5 text-right text-[11px] text-(--text-muted)">
                        {entry.length}/2000
                    </div>
                </div>
            ))}

            <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-dashed border-(--accent-primary)/50 bg-(--accent-primary)/10 px-3 py-2 text-sm font-medium text-(--accent-primary) transition-colors hover:bg-(--accent-primary)/20 disabled:opacity-50"
                disabled={disabled || list.length >= 20}
                onClick={() => setList([...list, ""])}
            >
                + Add candidate response ({list.length}/20)
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
        render: (v) => (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${matchModeClass(v)}`}>
                {matchModeLabel(v)}
            </span>
        ),
    },
    {
        key: "enabled",
        label: "Enabled",
        render: (v) => (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${v !== false ? "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30" : "bg-rose-500/15 text-rose-300 ring-rose-400/30"}`}>
                {v !== false ? "Active" : "Disabled"}
            </span>
        ),
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
        render: (v) => (
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${v ? "bg-indigo-500/15 text-indigo-300 ring-indigo-400/30" : "bg-zinc-500/15 text-zinc-300 ring-zinc-400/30"}`}>
                {v ? "Randomized" : "Static"}
            </span>
        ),
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
        label: "Response Studio",
        type: "custom",
        description: "Compose one deterministic response or manage a randomized pool of up to 20 responses.",
        render: ({ values, setValue, disabled }) => (
            <ResponseEditor values={values} setValue={setValue} disabled={disabled} />
        ),
    },
    {
        id: "_guildAssetsPicker",
        label: "Asset Inserter",
        type: "custom",
        description: "Insert server emojis, stickers, and GIF URLs into the active response field.",
        render: ({ values, setValue, disabled }) => (
            <GuildAssetsPicker
                disabled={disabled}
                onInsert={(token) => {
                    if (values.randomizeResponses) {
                        const currentList = getEditableResponses(values.responses, values.response);
                        const next = currentList.length > 0 ? [...currentList] : [""];
                        const requestedIndex = Number(values._activeResponseIndex);
                        const activeIndex = Number.isInteger(requestedIndex) ? requestedIndex : 0;
                        const targetIndex = Math.min(Math.max(activeIndex, 0), next.length - 1);
                        next[targetIndex] = appendResponseToken(next[targetIndex], token);
                        setValue("responses", next);
                        setValue("response", normalizeResponses(next, "")[0] || "");
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

        const total = responders.length;
        const enabled = responders.filter((item) => item.enabled !== false).length;
        const randomized = responders.filter((item) => item.randomizeResponses).length;
        const regexCount = responders.filter((item) => item.matchMode === "regex").length;

        return [
            {
                id: "_autoRespondersManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <div className="space-y-4">
                        <Card className="rounded-[28px] border border-(--border-subtle) bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_45%),linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] p-5 shadow-(--shadow-sm) md:p-6 lg:col-span-2">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                                        Auto-Responder
                                    </p>
                                    <h3 className="font-['Space_Grotesk'] text-2xl font-semibold text-(--text-primary)">
                                        Trigger-response rules
                                    </h3>
                                    <p className="mt-1 text-sm text-(--text-secondary)">
                                        Configure trigger matching, response lists, cooldowns, and asset tokens.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    <div className="rounded-xl border border-(--border-subtle) bg-(--surface-primary)/85 px-3 py-2">
                                        <p className="text-[10px] uppercase tracking-[0.12em] text-(--text-muted)">Total</p>
                                        <p className="text-lg font-semibold text-(--text-primary)">{total}</p>
                                    </div>
                                    <div className="rounded-xl border border-(--border-subtle) bg-(--surface-primary)/85 px-3 py-2">
                                        <p className="text-[10px] uppercase tracking-[0.12em] text-(--text-muted)">Active</p>
                                        <p className="text-lg font-semibold text-emerald-300">{enabled}</p>
                                    </div>
                                    <div className="rounded-xl border border-(--border-subtle) bg-(--surface-primary)/85 px-3 py-2">
                                        <p className="text-[10px] uppercase tracking-[0.12em] text-(--text-muted)">Randomized</p>
                                        <p className="text-lg font-semibold text-indigo-300">{randomized}</p>
                                    </div>
                                    <div className="rounded-xl border border-(--border-subtle) bg-(--surface-primary)/85 px-3 py-2">
                                        <p className="text-[10px] uppercase tracking-[0.12em] text-(--text-muted)">Regex</p>
                                        <p className="text-lg font-semibold text-violet-300">{regexCount}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <ItemManager
                            featureId="auto_responder"
                            items={responders}
                            columns={columns}
                            formFields={formFields}
                            itemLabel="Auto-Responder"
                            transformSubmit={transformSubmit}
                        />
                    </div>
                ),
            },
        ];
    },
};
