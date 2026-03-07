import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

const GUILD = "987654321098765432";

test.describe("Dashboard", () => {
    test.beforeEach(async ({ page }) => {
        await gotoGuild(page, "/dashboard");
    });

    test("page loads and shows welcome message", async ({ page }) => {
        await expect(page.locator("text=Welcome back").or(page.locator("text=Server mission control")).first()).toBeVisible({ timeout: 10_000 });
    });

    test("no horizontal overflow", async ({ page }) => {
        const overflows = await detectHorizontalOverflow(page);
        expect(overflows).toHaveLength(0);
    });

    test("insight metric cards are visible", async ({ page }) => {
        await expect(page.locator("text=Member footprint").or(page.locator("text=成員規模")).first()).toBeVisible();
    });

    test("two-column grid does not overflow near xl breakpoint", async ({ page }) => {
        const vw = page.viewportSize().width;
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vw + 2);
    });

    test("health items render in grid", async ({ page }) => {
        const healthCards = page.locator("text=Welcome flow").or(page.locator("text=歡迎流程"));
        await expect(healthCards.first()).toBeVisible();
    });

    test("focus board items are visible", async ({ page }) => {
        // Should see at least one focus board item
        const focusItem = page.locator("text=Clear the suggestion queue")
            .or(page.locator("text=Keep the queue clear"))
            .or(page.locator("text=優先清理建議佇列"))
            .or(page.locator("text=審核隊列維持清爽"));
        await expect(focusItem.first()).toBeVisible();
    });
});
