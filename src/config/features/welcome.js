import { Locale } from "../../utils/Language";

export const WelcomeFeature = {
    name: {
        en: "Welcome & Goodbye",
    },
    description: (
        <Locale
            en="Configure welcome messages, goodbye messages, embed style, colors, and auto-role assignments when members join or leave."
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

        return [
            {
                id: "welcomeChannelId",
                name: "Welcome Channel",
                description: "The channel where welcome & goodbye messages are sent",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                value: values.welcomeChannelId || "",
            },
            {
                id: "welcomeMessage",
                name: "Welcome Message",
                description:
                    "Message sent when a member joins. Use {user}, {server}, {membercount} as placeholders.",
                type: "string",
                value:
                    values.welcomeMessage ||
                    "Welcome to {server}, {user}! You are member #{membercount}.",
            },
            {
                id: "goodbyeMessage",
                name: "Goodbye Message",
                description:
                    "Message sent when a member leaves. Use {user}, {server}, {membercount} as placeholders.",
                type: "string",
                value:
                    values.goodbyeMessage ||
                    "{user} has left {server}. We now have {membercount} members.",
            },
            {
                id: "welcomeEmbed",
                name: "Use Embed Style",
                description:
                    "Send welcome/goodbye messages as rich embeds instead of plain text",
                type: "boolean",
                value: values.welcomeEmbed ?? true,
            },
            {
                id: "welcomeColor",
                name: "Welcome Color",
                description: "Embed color for welcome messages",
                type: "color",
                value: values.welcomeColor
                    ? `#${values.welcomeColor.toString(16).padStart(6, "0")}`
                    : "#00aa00",
            },
            {
                id: "goodbyeColor",
                name: "Goodbye Color",
                description: "Embed color for goodbye messages",
                type: "color",
                value: values.goodbyeColor
                    ? `#${values.goodbyeColor.toString(16).padStart(6, "0")}`
                    : "#ff0000",
            },
            {
                id: "autoRoleIds",
                name: "Auto Roles",
                description:
                    "Roles automatically assigned to new members (max 5)",
                type: "id_enum",
                choices: roleChoices,
                element: { type: "role" },
                multiple: true,
                value: values.autoRoleIds || [],
            },
        ];
    },
};
