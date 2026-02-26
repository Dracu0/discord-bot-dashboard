/**
 * Shared responsive layout tokens used across navbar, alerts, and other
 * fixed/floating chrome that must align with the main content area.
 */
export const contentWidth = {
    base: "calc(100vw - 6%)",
    md: "calc(100vw - 8%)",
    lg: "calc(100vw - 6%)",
    xl: "calc(100vw - 350px)",
    "2xl": "calc(100vw - 365px)",
};

/**
 * Standardised page padding-top that accounts for the fixed navbar height.
 */
export const PAGE_PT = { base: "100px", md: "80px" };
