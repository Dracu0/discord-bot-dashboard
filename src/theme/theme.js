import { createTheme } from '@mantine/core';
import { cssVariablesResolver } from './tokens';

export const theme = createTheme({
  primaryColor: 'brand',
  autoContrast: true,
  luminanceThreshold: 0.3,
  colors: {
    brand: [
      '#F3EEFF', '#E0D4FF', '#C5ADFF', '#A47AFF', '#8B5CF6',
      '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3B0F7A',
    ],
    navy: [
      '#d4ccf0', '#b3a5e0', '#9580d0', '#7B61C2', '#4C3A8A',
      '#3A2A6E', '#352560', '#2A2043', '#231B36', '#1A1230',
    ],
    accent: [
      '#ECFDF5', '#D1FAE5', '#A7F3D0', '#6EE7B7', '#34D399',
      '#10B981', '#059669', '#047857', '#065F46', '#064E3B',
    ],
    warning: [
      '#FFFBEB', '#FEF3C7', '#FDE68A', '#FCD34D', '#FBBF24',
      '#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F',
    ],
  },
  cssVariablesResolver,
  fontFamily: "'DM Sans', sans-serif",
  headings: {
    fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
    sizes: {
      h1: { fontSize: '30px', lineHeight: '1.2', fontWeight: '700' },
      h2: { fontSize: '24px', lineHeight: '1.3', fontWeight: '700' },
      h3: { fontSize: '20px', lineHeight: '1.35', fontWeight: '600' },
      h4: { fontSize: '16px', lineHeight: '1.4', fontWeight: '600' },
    },
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
  focusRing: 'auto',
  components: {
    Button: {
      defaultProps: { radius: 'md' },
      styles: {
        root: {
          transition: 'all 0.15s ease',
          '&:active': { transform: 'scale(0.98)' },
        },
      },
    },
    Card: {
      defaultProps: { radius: 'lg', padding: 'lg' },
      styles: {
        root: {
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease-out',
          '&:hover': {
            boxShadow: 'var(--shadow-md)',
          },
        },
      },
    },
    Paper: {
      defaultProps: { radius: 'lg', p: 'lg' },
      styles: {
        root: {
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.2s ease-out',
        },
      },
    },
    TextInput: {
      defaultProps: { radius: 'md' },
      styles: {
        input: {
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus': {
            borderColor: 'var(--accent-primary)',
            boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.15)',
          },
        },
      },
    },
    Select: {
      defaultProps: { radius: 'md' },
      styles: {
        input: {
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus': {
            borderColor: 'var(--accent-primary)',
            boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.15)',
          },
        },
      },
    },
    Textarea: {
      defaultProps: { radius: 'md' },
      styles: {
        input: {
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          '&:focus': {
            borderColor: 'var(--accent-primary)',
            boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.15)',
          },
        },
      },
    },
    Modal: {
      defaultProps: { radius: 'lg', centered: true },
      styles: {
        content: {
          backgroundColor: 'var(--surface-primary)',
          boxShadow: 'var(--shadow-xl)',
        },
        header: {
          backgroundColor: 'var(--surface-primary)',
        },
        overlay: {
          backdropFilter: 'blur(8px)',
        },
      },
    },
    Drawer: {
      defaultProps: { size: 285 },
    },
    Skeleton: {
      defaultProps: { radius: 'lg' },
    },
    Badge: {
      defaultProps: { radius: 'md' },
    },
    Alert: {
      styles: {
        root: {
          borderRadius: 'var(--radius-md)',
        },
      },
    },
    Menu: {
      styles: {
        dropdown: {
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
        },
      },
    },
    Tabs: {
      styles: {
        tab: {
          transition: 'all 0.15s ease',
        },
      },
    },
  },
});
