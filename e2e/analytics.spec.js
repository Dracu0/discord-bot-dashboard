import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

test.describe("Analytics", () => {
    test.beforeEach(async ({ page }) => {
        await gotoGuild(page, "/analytics");
    });

    test("page loads and displays key metrics", async ({ page }) => {
        await expect(page.locator("main").getByText(/Analytics|數據分析/).first()).toBeVisible({ timeout: 10_000 });
    });

    test("stat cards layout correctly on small screens", async ({ page }) => {
        const vw = page.viewportSize().width;
        // On mobile (< 640px), stat cards should stack in a single column
        if (vw < 640) {
            const grid = page.locator(".grid").filter({ hasText: /Mod Actions|審核操作/ }).first();
            const box = await grid.boundingBox();
            if (box) {
                expect(box.width).toBeLessThanOrEqual(vw);
            }
        }
    });

    test("no horizontal overflow", async ({ page }) => {
        const overflows = await detectHorizontalOverflow(page);
        expect(overflows).toHaveLength(0);
    });

    test("charts render without overflow", async ({ page }) => {
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        const vw = page.viewportSize().width;
        expect(scrollW).toBeLessThanOrEqual(vw + 2);
    });
});
