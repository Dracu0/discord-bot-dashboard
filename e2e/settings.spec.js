import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

test.describe("Settings", () => {
    test.beforeEach(async ({ page }) => {
        await gotoGuild(page, "/settings");
    });

    test("page loads settings form", async ({ page }) => {
        await expect(page.locator("main").getByText(/Settings|設定/).first()).toBeVisible({ timeout: 10_000 });
    });

    test("no horizontal overflow", async ({ page }) => {
        const overflows = await detectHorizontalOverflow(page);
        expect(overflows).toHaveLength(0);
    });
});
