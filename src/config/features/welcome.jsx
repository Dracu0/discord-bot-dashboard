import { Locale } from "../../utils/Language";
import WelcomePreview from "./previews/WelcomePreview";

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
                validate: (v) => {
                    if (!v || !v.trim()) return "Welcome message cannot be empty";
                    if (v.length > 2000) return "Message must be 2000 characters or less";
                },
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
                validate: (v) => {
                    if (!v || !v.trim()) return "Goodbye message cannot be empty";
                    if (v.length > 2000) return "Message must be 2000 characters or less";
                },
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
                id: "_welcomePreview",
                type: "preview",
                name: "Welcome Preview",
                render: () => (
                    <WelcomePreview
                        messageId="welcomeMessage"
                        colorId="welcomeColor"
                        embedId="welcomeEmbed"
                        label="Welcome"
                    />
                ),
            },
            {
                id: "_goodbyePreview",
                type: "preview",
                name: "Goodbye Preview",
                render: () => (
                    <WelcomePreview
                        messageId="goodbyeMessage"
                        colorId="goodbyeColor"
                        embedId="welcomeEmbed"
                        label="Goodbye"
                    />
                ),
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
                validate: (v) => {
                    if (Array.isArray(v) && v.length > 5) return "Maximum 5 auto roles allowed";
                },
            },
        ];
    },
};
