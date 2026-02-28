import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: [
      '#F3EEFF', '#E0D4FF', '#C5ADFF', '#A47AFF', '#8B5CF6',
      '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#3B0F7A',
    ],
    navy: [
      '#d4ccf0', '#b3a5e0', '#9580d0', '#7B61C2', '#4C3A8A',
      '#3A2A6E', '#352560', '#2A2043', '#231B36', '#1A1230',
    ],
  },
  fontFamily: "'DM Sans', sans-serif",
  headings: {
    fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
  components: {
    Button: {
      defaultProps: { radius: 'md' },
    },
    Card: {
      defaultProps: { radius: 'lg', padding: 'lg', withBorder: true },
    },
    Paper: {
      defaultProps: { radius: 'lg', p: 'lg', withBorder: true },
    },
    TextInput: {
      defaultProps: { radius: 'md' },
    },
    Select: {
      defaultProps: { radius: 'md' },
    },
    Textarea: {
      defaultProps: { radius: 'md' },
    },
    Modal: {
      defaultProps: { radius: 'lg', centered: true },
    },
    Drawer: {
      defaultProps: { size: 285 },
    },
    Skeleton: {
      defaultProps: { radius: 'lg' },
    },
  },
});
