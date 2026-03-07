import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";

const INTERVAL_CHOICES = [
    { label: "Every 1 hour", value: "3600000" },
    { label: "Every 2 hours", value: "7200000" },
    { label: "Every 4 hours", value: "14400000" },
    { label: "Every 6 hours", value: "21600000" },
    { label: "Every 8 hours", value: "28800000" },
    { label: "Every 12 hours", value: "43200000" },
    { label: "Every 24 hours", value: "86400000" },
];

function formatInterval(ms) {
    const match = INTERVAL_CHOICES.find((c) => c.value === String(ms));
    if (match) return match.label;
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 0 && m > 0) return `Every ${h}h ${m}m`;
    if (h > 0) return `Every ${h}h`;
    return `Every ${m}m`;
}

export const AnnouncementsFeature = {
    name: {
        en: "Scheduled Announcements",
    },
    description: (
        <Locale
            en="Schedule recurring messages to be posted automatically in any channel. Manage all schedules from this panel."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || [])
            .filter((ch) => ch.type === 0 || ch.type === 5)
            .map((ch) => ({ id: ch.id, name: `#${ch.name}`, icon: "channel" }));

        const announcements = values?.scheduledMessages || [];

        const columns = [
            { key: "channelId", label: "Channel", render: (v) => channelChoices.find((c) => c.id === v)?.name || v },
            { key: "message", label: "Message", render: (v) => v?.length > 50 ? v.slice(0, 50) + "…" : v },
            { key: "intervalMs", label: "Interval", render: (v) => formatInterval(v) },
            { key: "enabled", label: "Enabled", render: (v) => v ? "✅" : "❌" },
        ];

        const formFields = [
            { id: "channelId", label: "Channel", type: "channel", required: true, choices: channelChoices },
            { id: "message", label: "Message", type: "long_string", required: true, description: "The message to post (max 2000 chars).", validate: (v) => { if (v && v.length > 2000) return "Max 2000 characters"; } },
            { id: "intervalMs", label: "Repeat Interval", type: "enum", required: true, choices: INTERVAL_CHOICES, defaultValue: "3600000", description: "How often the message is sent." },
            { id: "cronLabel", label: "Label", type: "string", placeholder: "e.g. Daily Reminder", description: "Optional label for easy identification." },
            { id: "enabled", label: "Enabled", type: "boolean", defaultValue: true },
        ];

        return [
            {
                id: "_announcementsManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <ItemManager
                        featureId="announcements"
                        items={announcements}
                        columns={columns}
                        formFields={formFields}
                        itemLabel="Announcement"
                        transformSubmit={(data) => ({
                            ...data,
                            intervalMs: Number(data.intervalMs),
                        })}
                    />
                ),
            },
        ];
    },
};
