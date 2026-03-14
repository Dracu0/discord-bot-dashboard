# AGENTS - Cinnetron Dashboard

This repository uses AI-assisted workflows.

## Primary Rules

- Keep frontend (`src/`) and backend (`server/src/`) concerns separated.
- Preserve stable API response contracts used by dashboard views and contexts.
- Prefer incremental, testable changes over broad rewrites.

## Validation Expectations

- Frontend: `npm run lint`, `npm run test:run`, `npm run build`
- Backend: install cleanly and start without runtime boot errors.

## High-Risk Areas

- Auth/session/CSRF middleware
- Guild authorization checks
- Feature field and option mapping consistency
- WebSocket presence/invalidation flows

## Documentation Expectations

- Update `README.md` and `docs/code-review/` when behavior or architecture changes significantly.
