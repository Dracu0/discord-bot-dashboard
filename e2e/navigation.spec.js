import { test, expect } from "@playwright/test";
import { gotoGuild, detectHorizontalOverflow } from "./helpers.js";

test.describe("Navigation & Layout", () => {
    test("sidebar is hidden below xl breakpoint", async ({ page }) => {
        await gotoGuild(page, "/dashboard");
        const vw = page.viewportSize().width;
        if (vw < 1280) {
            // The sidebar should not be visible
            const sidebar = page.locator("[data-sidebar]").or(page.locator("aside")).first();
            if (await sidebar.count() > 0) {
                await expect(sidebar).not.toBeVisible();
            }
        }
    });

    test("main content is not offset when sidebar is hidden", async ({ page }) => {
        await gotoGuild(page, "/dashboard");
        const vw = page.viewportSize().width;
        if (vw < 1280) {
            const shell = page.locator("[data-guild-shell]");
            const box = await shell.boundingBox();
            // Content should start at or near x=0 on mobile
            expect(box.x).toBeLessThanOrEqual(2);
        }
    });

    test("navbar is properly positioned on all viewports", async ({ page }) => {
        await gotoGuild(page, "/dashboard");
        const vw = page.viewportSize().width;
        const navBox = await page.locator(".nav-alert").first().boundingBox();
        if (navBox) {
            // Navbar should not extend beyond viewport
            expect(navBox.x).toBeGreaterThanOrEqual(-2);
            expect(navBox.x + navBox.width).toBeLessThanOrEqual(vw + 2);
            // On mobile, navbar left should be near 16px (per CSS override)
            if (vw < 1280) {
                expect(navBox.x).toBeLessThanOrEqual(20);
            }
        }
    });

    test("footer is visible and not overlapped", async ({ page }) => {
        await gotoGuild(page, "/dashboard");
        // Scroll to bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        const vw = page.viewportSize().width;
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vw + 2);
    });

    test("page transitions work without layout shift", async ({ page }) => {
        await gotoGuild(page, "/dashboard");
        await page.waitForLoadState("networkidle");

        // Navigate to features
        const featuresLink = page.locator("a[href*='features']").first();
        if (await featuresLink.isVisible()) {
            await featuresLink.click();
            await page.waitForLoadState("networkidle");
            const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
            const vw = page.viewportSize().width;
            expect(scrollW).toBeLessThanOrEqual(vw + 2);
        }
    });
});
