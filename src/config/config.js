import { dashboardData } from "./dashboard-data";
import { WelcomeFeature } from "./features/welcome";
import { XPFeature } from "./features/xp";
import { SuggestionsFeature } from "./features/suggestions";
import { MinecraftFeature } from "./features/minecraft";
import { ModLogFeature } from "./features/modlog";
import { ManageSuggestionsAction } from "./actions/ManageSuggestions";
import { ModHistoryAction } from "./actions/ModHistory";

/**
 * @type ConfigType
 */
export const config = {
    name: "Discord Bot",
    footer: [
        {
            name: { en: "GitHub" },
            url: "https://github.com/Dracu0/Discord-Bot-v0.3.4"
        }
    ],
    settings: detail => [
        {
            id: "welcomeMessage",
            name: "Welcome Message",
            description: "Template for welcome messages. Placeholders: {user}, {server}, {membercount}",
            type: "string",
            value: detail["welcomeMessage"] || "Welcome to {server}, {user}!",
        },
        {
            id: "goodbyeMessage",
            name: "Goodbye Message",
            description: "Template for goodbye messages. Placeholders: {user}, {server}, {membercount}",
            type: "string",
            value: detail["goodbyeMessage"] || "{user} has left {server}.",
        },
        {
            id: "welcomeEmbed",
            name: "Use Embed for Welcome",
            description: "Send welcome/goodbye as rich embeds",
            type: "boolean",
            value: detail["welcomeEmbed"] ?? true,
        },
        {
            id: "welcomeColor",
            name: "Welcome Color",
            description: "Embed color for welcome messages",
            type: "color",
            value: detail["welcomeColor"] || "#00aa00",
        },
        {
            id: "goodbyeColor",
            name: "Goodbye Color",
            description: "Embed color for goodbye messages",
            type: "color",
            value: detail["goodbyeColor"] || "#ff0000",
        },
        {
            id: "suggestionCooldownMs",
            name: "Suggestion Cooldown (ms)",
            description: "Cooldown between suggestions per user (0 = no cooldown)",
            type: "number",
            value: detail["suggestionCooldownMs"] ?? 0,
        },
    ],
    actions: {
        "manage_suggestions": ManageSuggestionsAction,
        "mod_history": ModHistoryAction,
    },
    features: {
        "welcome": WelcomeFeature,
        "xp": XPFeature,
        "suggestions": SuggestionsFeature,
        "minecraft": MinecraftFeature,
        "modlog": ModLogFeature,
    },
    tutorialUrl: "https://github.com/Dracu0/Discord-Bot-v0.3.4",
    serverUrl: process.env.NODE_ENV === 'production' ? "" : "http://localhost:8080",
    inviteUrl: "https://discord.com/api/oauth2/authorize?client_id=1150062748848373850&permissions=8&scope=bot%20applications.commands",
    data: {
        dashboard: dashboardData,
    },
}