# Redesign Wave A — Audit Log UX Rewrite (Implemented)

Date: 2026-03-13

## Scope completed

This implementation upgrades the Audit Log experience for faster scanning and filtering, while preserving backend API contracts and route behavior.

## File changed

- `src/views/guild/audit-log/index.jsx`

## What changed

### 1) Filter bar redesign

- Added keyword search input for actor/category/source/target text matching.
- Added source filter (`All Sources`, `Dashboard`, `Bot`).
- Kept category and action filters.
- Added **Clear Filters** action when any filters are active.
- Added active-filter chips for immediate state visibility.

### 2) Table scanability improvements

- Added row hover treatment for better visual tracking.
- Preserved row expand/collapse behavior for diff entries.
- Made table header sticky within scroll container for improved orientation in long lists.

### 3) Diff readability upgrade

- Replaced inline one-line before/after snippets with two structured cards:
  - Before
  - After
- Values render as readable `pre` blocks with wrapping and scroll support.
- Handles object/string/null values robustly.

### 4) Pagination quality

- Replaced fixed first-5 pagination with a dynamic page window around current page.
- Added ellipsis rendering for large page counts.

### 5) Data behavior

- Server query key now includes `source` filter.
- Keyword search is client-side over current result page (low risk and no API changes).

## Validation

- Diagnostics for `src/views/guild/audit-log/index.jsx`: no errors ✅
- Production build: `npm run build` ✅

## Notes

- Existing large-chunk warning remains pre-existing and unrelated to this change.
- Client-side keyword filtering currently applies to fetched page items; moving keyword to server-side search can be a future enhancement if API support is added.
