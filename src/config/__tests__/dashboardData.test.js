import { describe, expect, it } from "vitest";
import { dashboardData } from "../dashboard-data";

describe("dashboardData server overview parity", () => {
    it("includes all implemented feature status rows", () => {
        const serverOverviewRow = dashboardData[1];
        const detail = {
            welcomeEnabled: true,
            xpEnabled: true,
            suggestionsEnabled: true,
            mcServers: 2,
            modLogEnabled: true,
            reactionRolesCount: 3,
            automodEnabled: true,
            starboardEnabled: false,
            ticketsEnabled: true,
            customCommandsCount: 5,
            announcementsCount: 4,
            activeTempRolesCount: 2,
            activeGiveawaysCount: 1,
            musicEnabled: true,
            autoRespondersCount: 6,
            afkCount: 7,
        };

        const infoMap = serverOverviewRow.items(detail)[0];
        const entries = infoMap.value;

        const labels = entries.map((entry) => entry.name);
        expect(labels).toEqual([
            "Welcome System",
            "XP System",
            "Suggestions",
            "Minecraft Servers",
            "Mod Log",
            "Reaction Roles",
            "Auto-Moderation",
            "Starboard",
            "Tickets",
            "Custom Commands",
            "Announcements",
            "Temporary Roles",
            "Giveaways",
            "Music",
            "Auto-Responder",
            "AFK Profiles",
        ]);

        expect(entries).toHaveLength(16);
    });

    it("shows sensible fallback values when detail payload is sparse", () => {
        const serverOverviewRow = dashboardData[1];
        const entries = serverOverviewRow.items({})[0].value;

        expect(entries.find((entry) => entry.name === "Minecraft Servers")?.value).toBe("0 configured");
        expect(entries.find((entry) => entry.name === "Custom Commands")?.value).toBe("0 configured");
        expect(entries.find((entry) => entry.name === "Temporary Roles")?.value).toBe("0 active");
        expect(entries.find((entry) => entry.name === "Music")?.value).toBe("❌ Disabled");
        expect(entries.find((entry) => entry.name === "AFK Profiles")?.value).toBe("0 active");
    });
});
