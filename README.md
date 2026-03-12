# Discord Bot Dashboard

Dashboard and API server for managing `Discord Bot v0.3.4` guild configuration, moderation workflows, analytics, and real-time bot status.

## Monorepo layout

```text
Discord Bot Dashboard/
├─ src/                # React dashboard (Vite)
├─ server/             # Express + MongoDB API server
├─ e2e/                # Playwright end-to-end tests
├─ build/              # Production frontend output
├─ Dockerfile          # Multi-stage container build
└─ fly.toml            # Fly.io deployment config
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (same DB used by bot)
- Discord application + bot credentials

## Quick start (local)

### 1) Install dependencies

```bash
npm install
cd server
npm install
```

### 2) Configure environment

#### Frontend

Copy root `.env.example` to `.env` and edit values as needed.

#### Server

Copy `server/.env.example` to `server/.env` and provide all required values:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_BOT_TOKEN`
- `DATABASE_TOKEN`
- `SESSION_SECRET`

### 3) Run backend API

```bash
cd server
npm run dev
```

### 4) Run frontend dashboard

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` and proxies API traffic to `http://localhost:8080` in development.

## Scripts

### Frontend (root)

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview production bundle
- `npm run test:run` — run Vitest
- `npm run test:e2e` — run Playwright suite

### Backend (`server/`)

- `npm run dev` — start API with nodemon
- `npm start` — start API normally

## Feature coverage

Dashboard currently supports configuration and management for:

- Welcome / goodbye
- XP and leveling
- Suggestions
- Minecraft monitoring
- Moderation log + warn thresholds
- Reaction roles
- Automod
- Starboard
- Tickets
- Custom commands
- Scheduled announcements
- Temporary roles
- Giveaways
- Music
- Auto-responder

## Testing

E2E coverage lives in `e2e/*.spec.js` and runs against:

1. `mock-server.cjs` (API mock)
2. Vite frontend dev server

Use:

```bash
npm run test:e2e
```

## Build and deployment

- `Dockerfile` builds frontend first, then packages server + static build.
- `fly.toml` is configured for Fly.io deployment.
- Health endpoint: `GET /health` (served by backend).

## Notes for contributors

- Keep frontend feature IDs in sync with backend `FEATURE_FIELDS`.
- Prefer structured API error responses (`status`, `code`, `message`, optional `details`).
- Run `npm run build` before submitting changes.
- For backend changes, also verify startup and route behavior in `server/`.
