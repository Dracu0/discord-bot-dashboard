import { test, expect } from "@playwright/test";

test.describe("Server Picker (/admin)", () => {
    test("renders server list without horizontal overflow", async ({ page }) => {
        await page.goto("/admin");
        await page.waitForLoadState("networkidle");
        // Should see at least one server card
        await expect(page.locator("text=Mock Server").first()).toBeVisible();

        // Check no horizontal overflow
        const vw = page.viewportSize().width;
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(vw + 2);
    });

    test("server card avatar is not too large on small screens", async ({ page }) => {
        await page.goto("/admin");
        await page.waitForLoadState("networkidle");
        const vw = page.viewportSize().width;
        // On larger screens, this test is not applicable
        if (vw >= 640) return;
        const avatar = page.locator("span[data-slot='avatar'], [role='img']").first();
        if (await avatar.count() === 0) return;
        const avatarSize = await avatar.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return { w: rect.width, h: rect.height };
        });
        // Avatar should not exceed 25% of viewport width on small screens
        expect(avatarSize.w).toBeLessThanOrEqual(vw * 0.25);
    });

    test("no content overflows viewport", async ({ page }) => {
        await page.goto("/admin");
        await page.waitForLoadState("networkidle");
        const vw = page.viewportSize().width;
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        expect(scrollW).toBeLessThanOrEqual(vw + 2);
    });
});
