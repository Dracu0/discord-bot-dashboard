import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

test.describe("Actions", () => {
    test.beforeEach(async ({ page }) => {
        await gotoGuild(page, "/actions");
    });

    test("page loads", async ({ page }) => {
        await expect(page.locator("main").getByText(/Actions|動作面板/).first()).toBeVisible({ timeout: 10_000 });
    });

    test("no horizontal overflow", async ({ page }) => {
        const overflows = await detectHorizontalOverflow(page);
        expect(overflows).toHaveLength(0);
    });
});
