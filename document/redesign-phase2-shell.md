# Redesign Phase 2 — Shell Refresh (Implemented)

Date: 2026-03-13

## Scope completed

This phase applies the first visible redesign updates to the dashboard shell (layout + sidebar + top navbar), while preserving existing routing, feature behavior, and page composition.

## Files changed

- `src/layouts/guild/index.jsx`
- `src/components/sidebar/Sidebar.jsx`
- `src/components/sidebar/components/Content.jsx`
- `src/components/sidebar/components/Links.jsx`
- `src/components/navbar/NavAlert.jsx`
- `src/components/navbar/NavbarLinksAdmin.jsx`

## What changed

### 1) Guild shell surface and rhythm

- Added a subtle accent-tinted top gradient layer to the shell background to reinforce identity without visual noise.
- Improved main content container sizing and spacing (`max-w-420`, larger bottom spacing) for better readability on large screens.
- Preserved fixed sidebar + navbar behavior and route rendering semantics.

### 2) Sidebar visual refinement

- Tuned desktop sidebar depth and edge treatment with accent-aware shadow.
- Polished collapse/expand control to match new tokenized border/surface styles.
- Added gradient hint in sidebar footer area for subtle separation.
- Kept width transition behavior and collapsed/expanded logic unchanged.

### 3) Sidebar content and navigation clarity

- Improved back-to-servers button visual consistency (tokenized border/surface states).
- Refined active navigation item treatment with tokenized inset highlight for better scanability.
- Maintained collapsed tooltip behavior and nested route rendering patterns.

### 4) Top navbar alert/header polish

- Enhanced navbar container border treatment between idle and scrolled states.
- Added dynamic elevation (stronger on scroll, softer accent ambient at rest).
- Improved action cluster surface and spacing for cleaner hierarchy and lower clutter.
- Preserved breadcrumb/title logic and `--page-top-offset` measurement flow.

### 5) Navbar action controls

- Harmonized icon button appearance with shell redesign (tokenized border + surface hover).
- Refined user menu trigger padding and grouping to improve click comfort and visual balance.

## Validation

- Build success after shell updates:
  - `npm run build` ✅
- Post-adjustment diagnostics:
  - `layouts/guild/index.jsx` has no errors ✅

## Notes

- This phase intentionally avoids information architecture changes and keeps interaction flows stable.
- The large-chunk build warning remains pre-existing and is not introduced by this phase.

## Recommended next phase

1. Start Wave A workflow redesign:
   - `views/guild/audit-log/*` (table find/compare/action optimization)
   - `components/fields/ConfigPanel.jsx` (form chunking + progressive disclosure)
2. Continue token adoption into remaining UI primitives for complete design-system consistency.
