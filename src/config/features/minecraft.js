import { Locale } from "../../utils/Language";

const PING_MODE_CHOICES = [
    { label: "Both (online & offline)", value: "both" },
    { label: "Online only", value: "online" },
    { label: "Offline only", value: "offline" },
];

const EMBED_MODE_CHOICES = [
    { label: "Edit existing message", value: "edit" },
    { label: "Resend new message", value: "resend" },
];

export const MinecraftFeature = {
    name: {
        en: "Minecraft Monitoring",
    },
    canToggle: true,
    description: (
        <Locale
            en="Monitor Minecraft Java servers — configure server IPs, online/offline alerts, live status embeds, and alert channels."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || []).map((ch) => ({
            id: ch.id,
            name: `#${ch.name}`,
            icon: "channel",
        }));

        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
            color: r.color,
            icon: "role",
        }));

        const servers = values.mcServers || [];

        const opts = [
            {
                id: "pingEnabled",
                name: "Enable Minecraft Commands",
                description:
                    "Toggle the /minecraft command and server monitoring",
                type: "boolean",
                value: values.pingEnabled ?? false,
            },
            {
                id: "mcServers",
                name: "Minecraft Servers",
                description:
                    "Configure monitored Minecraft servers (max 10 per guild). Each server needs a name and IP address.",
                type: "array",
                element: {
                    type: "string",
                    holder: "server-name:ip-address",
                },
                value: servers.map((s) => `${s.name}:${s.ip}`),
            },
        ];

        // Per-server alert & live embed settings
        servers.forEach((server, i) => {
            const tag = `[${server.name || `Server ${i + 1}`}]`;

            opts.push(
                {
                    id: `mcServer_${i}_alertChannelId`,
                    name: `${tag} Alert Channel`,
                    description:
                        "Channel where online/offline alerts are sent",
                    type: "id_enum",
                    choices: channelChoices,
                    element: { type: "channel" },
                    value: server.alertChannelId || "",
                },
                {
                    id: `mcServer_${i}_alertRoleId`,
                    name: `${tag} Alert Role`,
                    description:
                        "Role to ping when an alert is triggered",
                    type: "id_enum",
                    choices: roleChoices,
                    element: { type: "role" },
                    value: server.alertRoleId || "",
                },
                {
                    id: `mcServer_${i}_alertPingMode`,
                    name: `${tag} Alert Ping Mode`,
                    description:
                        "When to send alert pings",
                    type: "enum",
                    choices: PING_MODE_CHOICES,
                    value: server.alertPingMode || "both",
                },
                {
                    id: `mcServer_${i}_liveEmbedChannelId`,
                    name: `${tag} Live Embed Channel`,
                    description:
                        "Channel for the live server status embed",
                    type: "id_enum",
                    choices: channelChoices,
                    element: { type: "channel" },
                    value: server.liveEmbedChannelId || "",
                },
                {
                    id: `mcServer_${i}_liveEmbedMode`,
                    name: `${tag} Live Embed Mode`,
                    description:
                        "Whether to edit an existing embed or resend a new one each poll",
                    type: "enum",
                    choices: EMBED_MODE_CHOICES,
                    value: server.liveEmbedMode || "edit",
                }
            );
        });

        return opts;
    },
};
