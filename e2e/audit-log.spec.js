import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

test.describe("Audit Log", () => {
    test.beforeEach(async ({ page }) => {
        await gotoGuild(page, "/audit-log");
    });

    test("page loads and shows entries", async ({ page }) => {
        await expect(page.locator("main").getByText(/Audit Log|審計日誌/).first()).toBeVisible({ timeout: 10_000 });
    });

    test("no horizontal overflow", async ({ page }) => {
        const overflows = await detectHorizontalOverflow(page);
        expect(overflows).toHaveLength(0);
    });

    test("table container scrolls instead of overflowing viewport", async ({ page }) => {
        const vw = page.viewportSize().width;
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vw + 2);
    });
});
