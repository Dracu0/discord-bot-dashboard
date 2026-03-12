import { dashboardData } from "./dashboard-data";
import { WelcomeFeature } from "./features/welcome";
import { XPFeature } from "./features/xp";
import { SuggestionsFeature } from "./features/suggestions";
import { MinecraftFeature } from "./features/minecraft";
import { ModLogFeature } from "./features/modlog";
import { ReactionRolesFeature } from "./features/reactionroles";
import { AutoModFeature } from "./features/automod";
import { StarboardFeature } from "./features/starboard";
import { TicketsFeature } from "./features/tickets";
import { CustomCommandsFeature } from "./features/customcommands";
import { AnnouncementsFeature } from "./features/announcements";
import { TempRolesFeature } from "./features/temproles";
import { GiveawaysFeature } from "./features/giveaways";
import { MusicFeature } from "./features/music";
import { AutoResponderFeature } from "./features/autoresponder";
import { ManageSuggestionsAction } from "./actions/ManageSuggestions";
import { ModHistoryAction } from "./actions/ModHistory";

/**
 * Central dashboard configuration.
 * - `features`: Maps feature IDs to their config panel definitions. IDs must match server-side FEATURE_FIELDS keys.
 * - `actions`: Maps action IDs to action panel definitions.
 * - `serverUrl`: Base URL for API calls. Empty string in production (same-origin), localhost in dev.
 * - `inviteUrl`: Discord bot invite link.
 */

/**
 * @type ConfigType
 */
export const config = {
    name: "Cinnetron",
    footer: [
        {
            name: { en: "GitHub" },
            url: "https://github.com/Dracu0/Discord-Bot-v0.3.4"
        }
    ],
    settings: (currentSettings) => [
        {
            id: "colorScheme",
            name: "Color scheme",
            description: "Choose whether the dashboard follows your system, stays light, or stays dark.",
            type: "enum",
            choices: [
                { value: "system", label: "Match system" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
            ],
            value: currentSettings.colorScheme || "system",
        },
        {
            id: "accentColor",
            name: "Accent color",
            description: "Update the highlight color used across buttons, focus states, and callouts.",
            type: "enum",
            choices: [
                { value: "brand", label: "Brand Violet" },
                { value: "blue", label: "Blue" },
                { value: "teal", label: "Teal" },
                { value: "green", label: "Green" },
                { value: "orange", label: "Orange" },
                { value: "pink", label: "Pink" },
            ],
            value: currentSettings.accentColor || "brand",
        },
        {
            id: "sidebarCollapsed",
            name: "Collapsed sidebar by default",
            description: "Keep navigation compact when you open the dashboard.",
            type: "boolean",
            value: Boolean(currentSettings.sidebarCollapsed),
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
        "reaction_roles": ReactionRolesFeature,
        "automod": AutoModFeature,
        "starboard": StarboardFeature,
        "tickets": TicketsFeature,
        "custom_commands": CustomCommandsFeature,
        "announcements": AnnouncementsFeature,
        "temp_roles": TempRolesFeature,
        "giveaways": GiveawaysFeature,
        "music": MusicFeature,
        "auto_responder": AutoResponderFeature,
    },
    tutorialUrl: "https://github.com/Dracu0/Discord-Bot-v0.3.4",
    serverUrl: import.meta.env.PROD ? "/api" : "http://localhost:8080/api",
    inviteUrl: "https://discord.com/api/oauth2/authorize?client_id=1150062748848373850&permissions=8&scope=bot%20applications.commands",
    data: {
        dashboard: dashboardData,
    },
}