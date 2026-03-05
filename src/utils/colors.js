import { useTheme } from 'next-themes';

/**
 * Returns light or dark value based on the current color scheme.
 * Prefer CSS variables (var(--token-name)) for most cases.
 * Use this only when you need runtime-conditional values (e.g. third-party lib theming).
 */
export function useColorValue(light, dark) {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? dark : light;
}
