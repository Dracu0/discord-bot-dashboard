---
description: 'Standards for React and Node code in the dashboard repository.'
applyTo: '**/*.js, **/*.jsx, server/**/*.js'
---

# JavaScript / React Instructions

## Conventions
- Keep components focused; extract reusable logic into hooks or utility modules.
- Use explicit names for API helpers and route handlers.
- Prefer pure helpers for data transformations used across views.

## Frontend Rules
- Keep server state in React Query, not ad hoc global mutable objects.
- Add loading and error states for asynchronous UI paths.
- Keep feature config option definitions declarative.

## Backend Rules
- Validate request payloads before persistence.
- Return consistent error objects.
- Keep auth and guild access checks in middleware.

## Testing
- Add or update unit tests when modifying reducers, feature transforms, or critical utility functions.
- Keep E2E scenarios aligned with major user flows.
