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
    '--surface-overlay': 'rgba(240, 236, 247, 0.6)',

    '--text-primary': 'var(--mantine-color-navy-4)',
    '--text-secondary': '#2D2150',
    '--text-muted': '#7E72A0',

    '--border-default': 'var(--mantine-color-gray-3)',
    '--border-subtle': 'var(--mantine-color-gray-2)',

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
    '--surface-overlay': 'rgba(26, 18, 48, 0.6)',

    '--text-primary': 'var(--mantine-color-white)',
    '--text-secondary': '#A89DC0',
    '--text-muted': '#A89DC0',

    '--border-default': 'rgba(139, 92, 246, 0.12)',
    '--border-subtle': 'rgba(139, 92, 246, 0.06)',

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

/**
 * Mantine cssVariablesResolver — merges semantic, shadow, spacing
 * and radius tokens per light/dark scheme.
 */
export function cssVariablesResolver(theme) {
  const shared = { ...spaceTokens, ...radiusTokens };
  return {
    variables: shared,
    light: { ...colorTokens.light, ...shadowTokens.light },
    dark: { ...colorTokens.dark, ...shadowTokens.dark },
  };
}
