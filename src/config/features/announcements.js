import { Locale } from "../../utils/Language";

export const AnnouncementsFeature = {
    name: {
        en: "Scheduled Announcements",
    },
    description: (
        <Locale
            en="Schedule recurring messages to be posted automatically. Use /announce in Discord to schedule, remove, or list announcements."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || []).map((ch) => ({
            id: ch.id,
            name: `#${ch.name}`,
        }));

        const announcements = values.scheduledMessages || [];
        const entries = announcements.map((a) => {
            const channelName = channelChoices.find((c) => c.id === a.channelId)?.name || a.channelId;
            const label = a.cronLabel || "Custom";
            const status = a.enabled ? "✅" : "❌";
            return `${status} [${label}] → ${channelName}: ${a.message?.slice(0, 50) || ""}${a.message?.length > 50 ? "…" : ""}`;
        });

        return [
            {
                id: "_announcementsInfo",
                name: "Scheduled Announcements",
                description: entries.length > 0
                    ? entries.join("\n")
                    : "No scheduled announcements. Use `/announce schedule` in Discord to create them.",
                type: "boolean",
                value: announcements.length > 0,
            },
        ];
    },
};
