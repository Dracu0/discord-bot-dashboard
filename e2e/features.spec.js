import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

test.describe("Features", () => {
    test.beforeEach(async ({ page }) => {
        await gotoGuild(page, "/features");
    });

    test("page loads and shows feature cards", async ({ page }) => {
        await expect(page.locator("main").getByText(/Bot Features|功能面板/).first()).toBeVisible({ timeout: 10_000 });
    });

    test("no horizontal overflow", async ({ page }) => {
        const overflows = await detectHorizontalOverflow(page);
        expect(overflows).toHaveLength(0);
    });

    test("feature cards wrap correctly on small screens", async ({ page }) => {
        const vw = page.viewportSize().width;
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vw + 2);
    });
});
