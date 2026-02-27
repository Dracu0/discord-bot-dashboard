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
import { ManageSuggestionsAction } from "./actions/ManageSuggestions";
import { ModHistoryAction } from "./actions/ModHistory";

/**
 * @type ConfigType
 */
export const config = {
    name: "Mocotron",
    footer: [
        {
            name: { en: "GitHub" },
            url: "https://github.com/Dracu0/Discord-Bot-v0.3.4"
        }
    ],
    settings: (currentSettings) => [
        {
            id: "language",
            name: "Language",
            description: "Dashboard display language",
            type: "enum",
            choices: ["en", "zh"],
            value: currentSettings.language || "en",
        },
        {
            id: "fixedWidth",
            name: "Fixed Width",
            description: "Use a fixed viewport width for the dashboard layout",
            type: "boolean",
            value: currentSettings.fixedWidth ?? true,
        },
        {
            id: "devMode",
            name: "Developer Mode",
            description: "Enable developer mode for advanced options",
            type: "boolean",
            value: currentSettings.devMode ?? false,
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
    },
    tutorialUrl: "https://github.com/Dracu0/Discord-Bot-v0.3.4",
    serverUrl: process.env.NODE_ENV === 'production' ? "" : "http://localhost:8080",
    inviteUrl: "https://discord.com/api/oauth2/authorize?client_id=1150062748848373850&permissions=8&scope=bot%20applications.commands",
    data: {
        dashboard: dashboardData,
    },
}