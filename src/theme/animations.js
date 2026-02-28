/**
 * Reusable CSS animation transition presets.
 * Keyframes are defined in App.css — do NOT duplicate them here.
 * Import and spread into Mantine `style` props or CSS modules.
 */

// ── Transition presets (for inline styles) ────────────────────────
export const transitions = {
  /** Quick 150 ms ease — hover states, micro-interactions */
  fast: 'all 0.15s ease',
  /** Standard 200 ms ease-out — card hover, sidebar links */
  default: 'all 0.2s ease-out',
  /** Medium 250 ms cubic-bezier — sidebar collapse, layout shifts */
  medium: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  /** Slow 350 ms — page transitions, modal entrance */
  slow: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ── Style objects for common patterns ─────────────────────────────
export const cardHover = {
  transition: transitions.default,
  '&:hover': {
    transform: 'translateY(-2px)',
  },
};

export const pageEnter = {
  animation: 'slideUp 0.25s ease-out',
};

export const btnPress = {
  transition: transitions.fast,
  '&:active': {
    transform: 'scale(0.98)',
  },
};
