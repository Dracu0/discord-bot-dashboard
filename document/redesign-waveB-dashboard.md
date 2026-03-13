# Redesign Wave B — Dashboard Component Polish

## Scope

This update continues Wave B visual refinements on dashboard reusable components for clearer hierarchy, stronger status readability, and improved interaction affordances.

## Components Updated

### `src/views/guild/dashboard/components/InsightMetricCard.jsx`

- Added tone-based icon styling map for clearer semantic emphasis.
- Applied subtle card polish class (`rounded-2xl`, lightweight shadow) to align with updated card rhythm.

### `src/views/guild/dashboard/components/DashboardActionHint.jsx`

- Added grouped hover treatment with arrow micro-motion for clearer call-to-action affordance.
- Added `aria-label` fallback for better link accessibility when title content is non-plain text.
- Preserved existing badge/tone logic and routing behavior.

### `src/views/guild/dashboard/components/MissionSignal.jsx`

- Improved heading/value typography clarity with tighter tracking.
- Kept helper text and progress semantics intact.
- Marked decorative progress bar wrapper as `aria-hidden` to avoid redundant screen reader noise.

### `src/views/guild/dashboard/components/HealthListItem.jsx`

- Added subtle shadow and tighter title tracking for more legible row hierarchy.
- Preserved status badge and helper messaging behavior.

## Validation

- File diagnostics (all updated dashboard components): **no errors**.
- Production build (`npm run build`): **successful**.
- Existing non-blocking warning remains: large bundle/chunk-size advisory from Vite/Rollup.

## Notes

- Changes are presentational/accessibility-focused and intentionally avoid data-flow or API behavior changes.
- This keeps rollout risk low while improving daily operator scanability and task clarity.
