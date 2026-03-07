import { test as base, expect } from "@playwright/test";

/**
 * Extended test fixture that auto-navigates through authentication
 * and lands on a guild page ready for assertion.
 */
export const test = base.extend({
    /** Bypasses the sign-in gate by seeding the cookie/localStorage the app expects. */
    authenticatedPage: async ({ page }, use) => {
        // seed the mock-server session cookie so /api/auth/user resolves
        await page.context().addCookies([
            {
                name: "token",
                value: "mock-token",
                domain: "localhost",
                path: "/",
            },
        ]);
        await use(page);
    },
});

export { expect };

/** Navigate to a guild page with auth already set. */
export async function gotoGuild(page, path = "/dashboard") {
    await page.context().addCookies([
        { name: "token", value: "mock-token", domain: "localhost", path: "/" },
    ]);
    await page.goto(`/guild/987654321098765432${path}`);
    await page.waitForLoadState("networkidle");
}

/** Detect any element whose content overflows the viewport horizontally.
 *  Skips elements inside scrollable containers (overflow-x: auto/scroll). */
export async function detectHorizontalOverflow(page) {
    return page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const isInsideScroller = (el) => {
            let p = el.parentElement;
            while (p && p !== document.documentElement) {
                const ov = getComputedStyle(p).overflowX;
                if (ov === "auto" || ov === "scroll") return true;
                p = p.parentElement;
            }
            return false;
        };
        const overflows = [];
        for (const el of document.querySelectorAll("*")) {
            const rect = el.getBoundingClientRect();
            if ((rect.right > vw + 2 || rect.left < -2) && !isInsideScroller(el)) {
                overflows.push({
                    tag: el.tagName,
                    id: el.id,
                    className: String(el.className).slice(0, 80),
                    rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
                });
            }
        }
        return overflows;
    });
}

/** Check that all interactive elements have a minimum 44×44 touch target. */
export async function checkTouchTargets(page, selector = "button, a, [role='button']") {
    return page.evaluate((sel) => {
        const MIN = 44;
        const small = [];
        for (const el of document.querySelectorAll(sel)) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && (rect.width < MIN || rect.height < MIN)) {
                small.push({
                    tag: el.tagName,
                    text: (el.textContent || "").trim().slice(0, 40),
                    w: Math.round(rect.width),
                    h: Math.round(rect.height),
                });
            }
        }
        return small;
    }, selector);
}
