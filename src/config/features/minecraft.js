import { Locale } from "../../utils/Language";

export const MinecraftFeature = {
    name: {
        en: "Minecraft Monitoring",
    },
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

        // Build server options as an array with nested pair items
        const serverOptions = (values.mcServers || []).map((server) => ({
            name: server.name,
            ip: server.ip,
            alertChannelId: server.alertChannelId,
            alertRoleId: server.alertRoleId,
            alertPingMode: server.alertPingMode,
            liveEmbedChannelId: server.liveEmbedChannelId,
            liveEmbedMode: server.liveEmbedMode,
        }));

        return [
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
                value: serverOptions.map(
                    (s) => `${s.name}:${s.ip}`
                ),
            },
        ];
    },
};
