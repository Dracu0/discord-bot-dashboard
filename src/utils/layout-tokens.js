/**
 * Shared responsive layout tokens used across navbar, alerts, and other
 * fixed/floating chrome that must align with the main content area.
 */

export const SIDEBAR_FULL = 280;
export const SIDEBAR_COLLAPSED = 72;
export const SIDEBAR_HIDDEN = 0;

export function contentWidthFor(sidebarWidth) {
    return {
        base: "calc(100vw - 6%)",
        md: "calc(100vw - 8%)",
        lg: "calc(100vw - 6%)",
        xl: `calc(100vw - ${sidebarWidth + 70}px)`,
        "2xl": `calc(100vw - ${sidebarWidth + 85}px)`,
    };
}

export const contentWidth = contentWidthFor(SIDEBAR_FULL);

export const contentWidthCollapsed = contentWidthFor(SIDEBAR_COLLAPSED);

/**
 * Standardised page padding-top that accounts for the fixed navbar height.
 */
export const PAGE_PT = { base: "90px", md: "80px" };
