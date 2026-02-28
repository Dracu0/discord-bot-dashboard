/**
 * Centralized design tokens for the dashboard.
 *
 * Light/dark values are resolved by Mantine's cssVariablesResolver
 * and exposed as CSS custom properties so components can reference
 * them without hooks or re-renders.
 */

// ── Semantic color tokens (light / dark) ─────────────────────────
export const colorTokens = {
  light: {
    '--surface-primary': '#ffffff',
    '--surface-secondary': '#f8f9fa',
    '--surface-elevated': '#ffffff',
    '--surface-card': '#ffffff',
    '--surface-overlay': 'rgba(240, 236, 247, 0.6)',

    '--text-primary': '#1A1523',
    '--text-secondary': '#2D2150',
    '--text-muted': '#7E72A0',

    '--border-default': '#D0D5DD',
    '--border-subtle': '#E4E7EC',

    '--accent-primary': 'var(--mantine-color-brand-5)',
    '--accent-secondary': 'var(--mantine-color-brand-3)',

    '--status-success': '#10B981',
    '--status-success-bg': 'rgba(16, 185, 129, 0.1)',
    '--status-error': '#EF4444',
    '--status-error-bg': 'rgba(239, 68, 68, 0.1)',
    '--status-warning': '#F59E0B',
    '--status-warning-bg': 'rgba(245, 158, 11, 0.1)',
    '--status-info': '#3B82F6',
    '--status-info-bg': 'rgba(59, 130, 246, 0.1)',

    '--sidebar-bg': '#ffffff',
    '--sidebar-border': 'var(--mantine-color-gray-3)',
    '--sidebar-hover': 'var(--mantine-color-gray-1)',
    '--sidebar-active': 'rgba(139, 92, 246, 0.08)',

    '--navbar-bg': 'rgba(255, 255, 255, 0.75)',
    '--navbar-border': 'var(--mantine-color-gray-3)',
  },
  dark: {
    '--surface-primary': 'var(--mantine-color-navy-7)',
    '--surface-secondary': 'var(--mantine-color-navy-8)',
    '--surface-elevated': 'var(--mantine-color-navy-6)',
    '--surface-card': 'var(--mantine-color-navy-6)',
    '--surface-overlay': 'rgba(26, 18, 48, 0.6)',

    '--text-primary': 'var(--mantine-color-white)',
    '--text-secondary': '#C4B8DB',
    '--text-muted': '#9B8FBB',

    '--border-default': 'rgba(139, 92, 246, 0.20)',
    '--border-subtle': 'rgba(139, 92, 246, 0.12)',

    '--accent-primary': 'var(--mantine-color-brand-4)',
    '--accent-secondary': 'var(--mantine-color-brand-6)',

    '--status-success': '#10B981',
    '--status-success-bg': 'rgba(16, 185, 129, 0.12)',
    '--status-error': '#EF4444',
    '--status-error-bg': 'rgba(239, 68, 68, 0.12)',
    '--status-warning': '#F59E0B',
    '--status-warning-bg': 'rgba(245, 158, 11, 0.12)',
    '--status-info': '#3B82F6',
    '--status-info-bg': 'rgba(59, 130, 246, 0.12)',

    '--sidebar-bg': 'var(--mantine-color-navy-7)',
    '--sidebar-border': 'rgba(139, 92, 246, 0.12)',
    '--sidebar-hover': 'var(--mantine-color-navy-5)',
    '--sidebar-active': 'rgba(139, 92, 246, 0.12)',

    '--navbar-bg': 'rgba(26, 18, 48, 0.65)',
    '--navbar-border': 'rgba(139, 92, 246, 0.12)',
  },
};

// ── Shadow scale ────────────────────────────────────────────────
export const shadowTokens = {
  light: {
    '--shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
    '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    '--shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
  },
  dark: {
    '--shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.2)',
    '--shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.2)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
    '--shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
  },
};

// ── Spacing scale ───────────────────────────────────────────────
export const spaceTokens = {
  '--space-xs': '4px',
  '--space-sm': '8px',
  '--space-md': '16px',
  '--space-lg': '24px',
  '--space-xl': '32px',
  '--space-2xl': '48px',
  '--space-3xl': '64px',
};

// ── Radius scale ────────────────────────────────────────────────
export const radiusTokens = {
  '--radius-sm': '8px',
  '--radius-md': '12px',
  '--radius-lg': '16px',
  '--radius-xl': '20px',
};

// ── Z-index scale ───────────────────────────────────────────────
export const zIndexTokens = {
  '--z-dropdown': '100',
  '--z-sticky': '200',
  '--z-overlay': '300',
  '--z-modal': '400',
  '--z-popover': '500',
  '--z-toast': '600',
};

// ── Typography tokens ───────────────────────────────────────────
export const typographyTokens = {
  '--font-body': "'DM Sans', sans-serif",
  '--font-heading': "'Space Grotesk', 'DM Sans', sans-serif",
  '--font-mono': "'JetBrains Mono', 'Fira Code', monospace",
  '--line-height-tight': '1.2',
  '--line-height-normal': '1.5',
  '--line-height-relaxed': '1.75',
  '--letter-spacing-tight': '-0.02em',
  '--letter-spacing-normal': '0',
  '--letter-spacing-wide': '0.02em',
};

// ── Animation tokens ────────────────────────────────────────────
export const animationTokens = {
  '--transition-fast': '0.15s ease',
  '--transition-normal': '0.25s cubic-bezier(.4,0,.2,1)',
  '--transition-slow': '0.4s cubic-bezier(.4,0,.2,1)',
};

/**
 * Mantine cssVariablesResolver — merges semantic, shadow, spacing,
 * radius, z-index, typography and animation tokens per light/dark scheme.
 */
export function cssVariablesResolver(theme) {
  const shared = {
    ...spaceTokens,
    ...radiusTokens,
    ...zIndexTokens,
    ...typographyTokens,
    ...animationTokens,
  };
  return {
    variables: shared,
    light: { ...colorTokens.light, ...shadowTokens.light },
    dark: { ...colorTokens.dark, ...shadowTokens.dark },
  };
}
