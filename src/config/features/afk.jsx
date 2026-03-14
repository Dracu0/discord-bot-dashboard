import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";

function formatTimestamp(dateStr) {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "Unknown";

    const diff = Date.now() - date.getTime();
    const mins = Math.max(0, Math.floor(diff / 60000));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins > 0) return `${mins}m ago`;
    return "Just now";
}

function transformSubmit(data) {
    return {
        ...data,
        userId: String(data.userId || "").trim(),
        reason: String(data.reason || "").trim(),
    };
}

export const AFKFeature = {
    name: {
        en: "AFK Status",
    },
    description: (
        <Locale
            en="Manage AFK entries for members. The bot will still auto-clear AFK when users send a message."
        />
    ),
    options: (values) => {
        const afkEntries = values?.afkEntries || [];

        const columns = [
            { key: "userId", label: "User ID" },
            {
                key: "reason",
                label: "Reason",
                render: (v) => (v?.length > 64 ? `${v.slice(0, 64)}…` : v),
            },
            { key: "timestamp", label: "Set", render: (v) => formatTimestamp(v) },
        ];

        const formFields = [
            {
                id: "userId",
                label: "User ID",
                type: "string",
                required: true,
                immutable: true,
                placeholder: "123456789012345678",
                description: "Discord user ID (17–20 digits).",
                validate: (v) => {
                    if (!v) return "User ID is required";
                    if (!/^\d{17,20}$/.test(String(v))) return "Must be a valid Discord user ID (17–20 digits)";
                },
            },
            {
                id: "reason",
                label: "AFK Reason",
                type: "string",
                required: true,
                placeholder: "Out for lunch",
                validate: (v) => {
                    const text = String(v || "").trim();
                    if (!text) return "Reason is required";
                    if (text.length > 200) return "Reason must be 200 characters or less";
                },
            },
        ];

        return [
            {
                id: "_afkManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <ItemManager
                        featureId="afk"
                        items={afkEntries}
                        columns={columns}
                        formFields={formFields}
                        itemLabel="AFK Entry"
                        transformSubmit={transformSubmit}
                    />
                ),
            },
        ];
    },
};