/**
 * Shared responsive layout tokens used across navbar, alerts, and other
 * fixed/floating chrome that must align with the main content area.
 */

export const SIDEBAR_FULL = 280;
export const SIDEBAR_COLLAPSED = 72;
export const SIDEBAR_HIDDEN = 0;
export const NAVBAR_HEIGHT = 64;
export const NAVBAR_TOP_OFFSET = 12;
export const NAVBAR_TOP_OFFSET_MD = 16;

/**
 * Returns the content width CSS calc string for a given sidebar width.
 * Used in inline styles where dynamic sidebar width needs to be accounted for.
 */
export function contentWidthCalc(sidebarWidth, extraPx = 70) {
    return `calc(100vw - ${sidebarWidth + extraPx}px)`;
}

/**
 * Standardised page padding-top that accounts for the fixed navbar height.
 */
export const PAGE_PT_BASE = `${NAVBAR_HEIGHT + NAVBAR_TOP_OFFSET}px`;
export const PAGE_PT_MD = `${NAVBAR_HEIGHT + NAVBAR_TOP_OFFSET_MD}px`;
export const PAGE_PT = PAGE_PT_MD;
