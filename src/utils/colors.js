import { useComputedColorScheme } from '@mantine/core';

function useColorValue(light, dark) {
  const scheme = useComputedColorScheme('dark');
  return scheme === 'dark' ? dark : light;
}

export { useColorValue };

export function useAlertBg() {
  return useColorValue('rgba(240,236,247,0.5)', 'rgba(26,18,48,0.5)');
}

export function useBrandBg() {
  return useColorValue('var(--mantine-color-brand-5)', 'var(--mantine-color-brand-4)');
}

export function useTextColor() {
  return useColorValue('var(--mantine-color-navy-4)', 'var(--mantine-color-white)');
}

export function useDetailColor() {
  return useColorValue('#2D2150', '#A89DC0');
}

export function useNoteColor() {
  return useColorValue('#7E72A0', '#A89DC0');
}

export function useSuccessBg() {
  return useColorValue('#6EE7B7', '#10B981');
}

export function useIconColor() {
  return useColorValue('var(--mantine-color-brand-5)', 'var(--mantine-color-white)');
}

export function useCardBg() {
  return useColorValue('var(--mantine-color-white)', 'var(--mantine-color-navy-7)');
}

export function useSurface1() {
  return useCardBg();
}

export function useSurface2() {
  return useColorValue('var(--mantine-color-gray-1)', 'var(--mantine-color-navy-6)');
}

export function useSurfaceBg() {
  return useColorValue('#F0ECF7', 'var(--mantine-color-navy-9)');
}

export function useBorderColor() {
  return useColorValue('var(--mantine-color-gray-3)', 'var(--mantine-color-dark-4)');
}