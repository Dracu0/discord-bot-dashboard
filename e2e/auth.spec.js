import { test, expect } from "@playwright/test";

test.describe("Auth & Sign-in", () => {
    test("unauthenticated user sees sign-in page", async ({ page }) => {
        // Mock server always returns 200 for /api/auth, so the user is always logged in.
        // To test the sign-in page, we intercept the auth check to return 401.
        await page.route("**/api/auth", (route) =>
            route.fulfill({ status: 401, body: "" })
        );
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(/signin|auth/);
    });

    test("authenticated user is redirected to /admin", async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(/admin/);
    });
});
