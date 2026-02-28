/**
 * Reusable CSS animation keyframes and transition presets.
 * Import and spread into Mantine `style` props or CSS modules.
 */

// ── Keyframe definitions (inject once via App.css or a global style) ──
export const keyframes = `
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0;  }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(139, 92, 246, 0); }
}
`;

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
