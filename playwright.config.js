import { defineConfig } from "@playwright/test";

const CI = !!process.env.CI;

export default defineConfig({
    testDir: "./e2e",
    timeout: 30_000,
    expect: { timeout: 5_000 },
    fullyParallel: true,
    forbidOnly: CI,
    retries: CI ? 2 : 0,
    workers: CI ? 1 : undefined,
    reporter: [["html", { open: "never" }]],
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },

    projects: [
        { name: "mobile-s", use: { viewport: { width: 320, height: 568 } } },
        { name: "mobile-m", use: { viewport: { width: 375, height: 667 } } },
        { name: "mobile-l", use: { viewport: { width: 414, height: 896 } } },
        { name: "tablet-portrait", use: { viewport: { width: 768, height: 1024 } } },
        { name: "tablet-landscape", use: { viewport: { width: 1024, height: 768 } } },
        { name: "laptop", use: { viewport: { width: 1280, height: 720 } } },
        { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
        { name: "wide", use: { viewport: { width: 1920, height: 1080 } } },
        { name: "4k", use: { viewport: { width: 2560, height: 1440 } } },
    ],

    webServer: [
        {
            command: "node mock-server.cjs",
            port: 8080,
            reuseExistingServer: !CI,
        },
        {
            command: "npx vite --port 3000",
            port: 3000,
            reuseExistingServer: !CI,
        },
    ],
});
