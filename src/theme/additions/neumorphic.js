/**
 * Mocotron neumorphic shadow tokens.
 * Import these in components for consistent raised/inset/flat surfaces.
 *
 * Depth hierarchy (lowest → highest):
 *   neuSubtle  – nested sub-cards, list items
 *   neuFlat    – resting interactive elements
 *   neuRaised  – cards at rest
 *   neuHover   – cards/buttons on hover
 *   neuElevated – sidebar, persistent chrome
 */

export const neuLight = {
  subtle: "1px 1px 3px #d1cbe0, -1px -1px 3px #faf8fe",
  flat: "2px 2px 5px #d1cbe0, -2px -2px 5px #faf8fe",
  raised: "4px 4px 12px #d1cbe0, -4px -4px 12px #faf8fe",
  hover: "6px 6px 16px #d1cbe0, -6px -6px 16px #faf8fe",
  elevated: "8px 8px 24px #d1cbe0, -4px -4px 12px #faf8fe",
  inset: "inset 3px 3px 6px #d1cbe0, inset -3px -3px 6px #faf8fe",
  pressed: "inset 2px 2px 5px #d1cbe0, inset -2px -2px 5px #faf8fe",
  glow: "0 0 20px rgba(124, 58, 237, 0.25)",
};

export const neuDark = {
  subtle: "1px 1px 3px #110d1e, -1px -1px 3px #352a54",
  flat: "2px 2px 5px #110d1e, -2px -2px 5px #352a54",
  raised: "4px 4px 12px #110d1e, -4px -4px 12px #352a54",
  hover: "6px 6px 16px #0e0a19, -6px -6px 16px #352a54",
  elevated: "8px 8px 24px #110d1e, -4px -4px 12px #352a54",
  inset: "inset 3px 3px 6px #110d1e, inset -3px -3px 6px #352a54",
  pressed: "inset 2px 2px 5px #110d1e, inset -2px -2px 5px #352a54",
  glow: "0 0 20px rgba(139, 92, 246, 0.3)",
};
