# Redesign Wave A — Config Panel UX Upgrade (Implemented)

Date: 2026-03-13

## Scope completed

This implementation improves configuration workflows by making save state and validation issues much more visible and actionable, while preserving existing mutation, undo/redo, and hotkey behavior.

## Files changed

- `src/components/fields/ConfigPanel.jsx`
- `src/components/alert/SaveAlert.jsx`

## What changed

### 1) Error visibility and recovery

- Added `ErrorSummary` panel to `ConfigPanel`.
- Shows top validation issues with field labels for faster diagnosis.
- Indicates when additional errors exist beyond the visible list.

### 2) Save state clarity

- Enhanced `SaveAlert` with:
  - error count
  - changed-field count
  - keyboard shortcut hint (`Ctrl+S`)
- Updated messaging to clearly differentiate:
  - unsaved changes state
  - blocked-by-validation state

### 3) Section readability

- Grouped config sections now render in tokenized bordered surface containers.
- Improves visual chunking for long, mixed-type forms.

### 4) Multi-config parity

- `MultiConfigPanel` now computes and passes change/error counts to `SaveAlert` for consistent feedback behavior.

## Validation

- Diagnostics:
  - `ConfigPanel.jsx`: no errors ✅
  - `SaveAlert.jsx`: no errors ✅
- Production build:
  - `npm run build` ✅

## Notes

- No API contract changes.
- No behavior change to save mutation semantics.
- Existing large-chunk warning remains pre-existing.
