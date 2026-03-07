import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

test.describe("Leaderboard", () => {
    test.beforeEach(async ({ page }) => {
        await gotoGuild(page, "/leaderboard");
    });

    test("page loads and shows leaderboard entries", async ({ page }) => {
        await expect(page.locator("main").getByText(/Leaderboard|排行榜/).first()).toBeVisible({ timeout: 10_000 });
        // Should show at least one user from mock data
        await expect(page.locator("text=Alice").first()).toBeVisible();
    });

    test("no horizontal overflow", async ({ page }) => {
        const overflows = await detectHorizontalOverflow(page);
        expect(overflows).toHaveLength(0);
    });

    test("table fits within viewport", async ({ page }) => {
        const vw = page.viewportSize().width;
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vw + 2);
    });
});
