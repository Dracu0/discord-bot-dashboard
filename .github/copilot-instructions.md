# Project: Cinnetron Dashboard

## Overview
React + Vite admin dashboard and Express API for managing Discord bot configuration, moderation workflows, analytics, and live status.

## Tech Stack
- Frontend: React 18, Vite 6, React Router, React Query
- Backend: Node.js, Express 4, Passport OAuth2, Mongoose, Redis (optional)
- Testing: Vitest, Playwright

## Architecture Notes
- Frontend app lives in `src/`.
- API server lives in `server/src/`.
- Feature configuration is schema-driven and rendered by generic field components.
- Guild-facing APIs are under `server/src/routes/guild/*`.

## Development Workflow
1. Keep API contracts and feature field IDs synchronized between frontend and backend.
2. Prefer adding validation in backend route handlers and mirrored client-side validation where useful.
3. Run `npm run lint`, `npm run test:run`, and `npm run build` before merge.
4. For backend changes, verify server startup and route behavior locally.

## Quality and Security
- Preserve structured API error shapes: `status`, `code`, `message`, and optional `details`.
- Maintain CSRF/session protections and rate-limits.
- Avoid introducing unsafe dynamic eval/regex patterns without hard limits.

## Do Not
- Do not bypass `requireAuth`/`requireGuildAccess` middleware for guild data routes.
- Do not couple feature-specific UI logic directly into core form renderer when schema options can express behavior.
