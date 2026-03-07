import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";

function formatTimeLeft(dateStr) {
    if (!dateStr) return "Unknown";
    const d = new Date(dateStr);
    const now = new Date();
    if (d <= now) return "Ended";
    const diff = d - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hours}h left`;
    return hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`;
}

export const GiveawaysFeature = {
    name: {
        en: "Giveaways",
    },
    description: (
        <Locale
            en="Run reaction-based giveaways with automatic winner selection. Create, manage, and end giveaways from this panel."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || [])
            .filter((ch) => ch.type === 0 || ch.type === 5)
            .map((ch) => ({ id: ch.id, name: `#${ch.name}`, icon: "channel" }));

        const giveaways = values?.giveaways || [];

        const columns = [
            { key: "prize", label: "Prize" },
            { key: "channelId", label: "Channel", render: (v) => channelChoices.find((c) => c.id === v)?.name || v },
            { key: "winnersCount", label: "Winners" },
            { key: "endsAt", label: "Ends", render: (v, item) => item.ended ? "✅ Ended" : formatTimeLeft(v) },
        ];

        const formFields = [
            { id: "channelId", label: "Channel", type: "channel", required: true, choices: channelChoices, description: "The channel where the giveaway message will be posted." },
            { id: "prize", label: "Prize", type: "string", required: true, placeholder: "Nitro Classic", description: "What participants can win (max 256 chars).", validate: (v) => { if (v && v.length > 256) return "Max 256 characters"; } },
            { id: "winnersCount", label: "Number of Winners", type: "number", defaultValue: 1, description: "How many winners to pick (1–20).", validate: (v) => { if (v < 1 || v > 20) return "Must be between 1 and 20"; } },
            { id: "duration", label: "Duration", type: "duration", required: true, defaultValue: 86400000, description: "How long the giveaway lasts (1 min – 30 days).", duration: { duration: { baseUnit: "milliseconds", units: ["minutes", "hours", "days"], min: 60000, max: 30 * 24 * 60 * 60 * 1000 } } },
        ];

        return [
            {
                id: "_giveawaysManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <ItemManager
                        featureId="giveaways"
                        items={giveaways}
                        columns={columns}
                        formFields={formFields}
                        itemLabel="Giveaway"
                    />
                ),
            },
        ];
    },
};
