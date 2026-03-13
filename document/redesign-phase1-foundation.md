# Redesign Phase 1 — Foundation (Implemented)

Date: 2026-03-13

## Scope completed

This initial implementation starts the dashboard redesign by introducing a tokenized foundation and accessibility-focused interaction primitives without breaking existing UI semantics.

### 1) Token architecture groundwork

Updated `src/assets/css/App.css` with an initial layered model:

- **Reference aliases** (raw palette/space/radius)
  - `--ref-color-brand-*`
  - `--ref-space-*`
  - `--ref-radius-*`
- **System tokens** (semantic/context-aware)
  - `--sys-color-*`
  - `--sys-focus-ring-*`
- **Component-level seed token**
  - `--comp-interactive-min-target`
  - `--comp-interactive-min-target-coarse`

Back-compat aliases were kept to avoid regressions:

- `--focus-ring-color`
- `--focus-ring-soft`
- `--focus-ring-offset-color`

### 2) Accessibility focus behavior hardening

In `App.css`:

- Strengthened global `:focus-visible` styles to use system focus tokens.
- Added enriched ring treatment for interactive elements via `:where(button, [role="button"], a, input, select, textarea, [tabindex]):focus-visible`.
- Added `touch-target` utility with WCAG 2.2 target-size-aware min size rules:
  - Base min target: `24px`
  - Coarse pointers: `40px`

### 3) Component adoption (first slice)

Updated primitives:

- `src/components/ui/button.jsx`
  - Added `touch-target` helper
  - Switched focus ring to centralized focus tokens
- `src/components/ui/input.jsx`
  - Switched focus ring styling to centralized focus tokens and offset color
- `src/components/ui/textarea.jsx`
  - Switched focus ring styling to centralized focus tokens and offset color
- `src/components/ui/select.jsx`
  - Added `touch-target` helper on trigger
  - Switched focus ring styling to centralized focus tokens and offset color
- `src/components/ui/switch.jsx`
  - Added `touch-target` helper
  - Switched focus ring to centralized focus tokens and offset color

## Validation

- Production build executed successfully:
  - `npm run build` ✅
- Editor diagnostics show one stylistic suggestion in `input.jsx` (`rounded-(--radius-md)` could be `rounded-md`), but compilation is healthy and behavior remains unchanged.

## Why this sequencing

This phase avoids broad visual churn while establishing a durable foundation for upcoming page-level redesign work. It is intentionally backward compatible so existing routes remain stable.

## Next implementation steps

1. Extend component-token adoption to core primitives (`select`, `textarea`, `tabs`, `dialog`, `table`, `pagination`, `tooltip`, `badge`).
2. Normalize interactive states (hover/active/disabled/loading) across all UI primitives.
3. Begin shell redesign in `layouts/guild/index.jsx` and navigation components (`sidebar/*`, `navbar/*`) using the new token model.
4. Start high-impact workflow migration (Wave A):
   - `views/guild/audit-log/*`
   - `components/fields/ConfigPanel.jsx`
