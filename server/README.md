# Cinnetron Dashboard - Backend Server

Express.js API server that bridges the dashboard frontend with the Cinnetron bot's MongoDB database and the Discord API.

## Prerequisites

- Node.js 18+
- The Discord Bot (v0.3.4) running and connected to MongoDB
- A Discord Application with OAuth2 configured

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable                | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `DISCORD_CLIENT_ID`     | Your Discord application's client ID                                         |
| `DISCORD_CLIENT_SECRET` | Your Discord application's client secret                                     |
| `DISCORD_BOT_TOKEN`     | Your bot's token (same as the bot uses)                                      |
| `DATABASE_TOKEN`        | MongoDB connection string (same as the bot uses)                             |
| `PORT`                  | API server port (default: 8080)                                              |
| `SESSION_SECRET`        | Random secret string for session encryption                                  |
| `DASHBOARD_URL`         | Frontend URL (default: `http://localhost:3000`)                              |
| `CALLBACK_URL`          | OAuth2 callback URL (default: `http://localhost:8080/auth/discord/callback`) |

### 3. Configure Discord OAuth2

In your [Discord Developer Portal](https://discord.com/developers/applications):

1. Go to your application → OAuth2
2. Add redirect URL: `http://localhost:8080/auth/discord/callback`
3. For Fly.io / production, also add: `https://discord-bot-dashboard.fly.dev/auth/discord/callback`
4. Copy Client ID and Client Secret to your `.env`

### 4. Update Frontend Config

In `src/config/config.js`, update:

- `serverUrl` → your API server URL (default: `http://localhost:8080`)
- `inviteUrl` → your bot's invite URL with your client ID

### 5. Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

| Method | Path                     | Description       |
| ------ | ------------------------ | ----------------- |
| `HEAD` | `/auth` or `/api/auth`                  | Check auth status |
| `GET`  | `/auth/discord` or `/api/auth/discord`          | Start OAuth2 flow |
| `GET`  | `/auth/discord/callback` or `/api/auth/discord/callback` | OAuth2 callback   |
| `POST` | `/auth/signout` or `/api/auth/signout`          | Sign out          |

### User

| Method | Path         | Description              |
| ------ | ------------ | ------------------------ |
| `GET`  | `/users/@me` | Current user info        |
| `GET`  | `/guilds`    | User's manageable guilds |

### Guild

| Method | Path                         | Description                     |
| ------ | ---------------------------- | ------------------------------- |
| `GET`  | `/guild/:id`                 | Guild basic info                |
| `GET`  | `/guild/:id/detail`          | Server dashboard details        |
| `GET`  | `/guild/:id/detail/advanced` | XP stats, suggestions, mod logs |
| `GET`  | `/guild/:id/notification`    | Guild notifications             |
| `GET`  | `/guild/:id/leaderboard`     | XP leaderboard (paginated)      |

### Features

| Method  | Path                                    | Description                    |
| ------- | --------------------------------------- | ------------------------------ |
| `GET`   | `/guild/:id/features`                   | List features + enabled status |
| `PATCH` | `/guild/:id/feature/:featureId/enabled` | Enable/disable feature         |
| `GET`   | `/guild/:id/feature/:featureId`         | Get feature config values      |
| `PATCH` | `/guild/:id/feature/:featureId`         | Update feature config          |

### Settings

| Method  | Path                  | Description           |
| ------- | --------------------- | --------------------- |
| `GET`   | `/guild/:id/settings` | Get guild settings    |
| `PATCH` | `/guild/:id/settings` | Update guild settings |

### Actions

| Method  | Path                                  | Description      |
| ------- | ------------------------------------- | ---------------- |
| `GET`   | `/guild/:id/actions`                  | Get actions data |
| `GET`   | `/guild/:id/action/:actionId`         | Get action tasks |
| `GET`   | `/guild/:id/action/:actionId/:taskId` | Get task detail  |
| `PATCH` | `/guild/:id/action/:actionId/:taskId` | Update task      |

## Architecture

```text
server/
├── src/
│   ├── index.js          # Express app setup, middleware, MongoDB connection
│   ├── auth/
│   │   ├── passport.js   # Discord OAuth2 strategy
│   │   └── middleware.js  # Auth & guild permission guards
│   ├── models/            # Mongoose schemas (shared with bot)
│   │   ├── GuildConfiguration.js
│   │   ├── Level.js
│   │   ├── ModLog.js
│   │   └── Suggestion.js
│   ├── routes/
│   │   ├── auth.js        # OAuth2 login/logout
│   │   ├── users.js       # User info & guild list
│   │   └── guild.js       # All guild operations
│   └── utils/
│       └── discord.js     # Discord REST API wrapper
```

## Features Mapped

| Dashboard Feature    | Bot Feature           | Config Fields                                                                                           |
| -------------------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| Welcome & Goodbye    | `/config-welcome`     | welcomeChannelId, welcomeMessage, goodbyeMessage, welcomeEmbed, welcomeColor, goodbyeColor, autoRoleIds |
| XP & Leveling        | `/config-xp`          | xpIgnoredChannelIds, xpLevelUpChannelId, xpDisableLevelUpMessages, levelRoles                           |
| Suggestions          | `/config-suggestions` | suggestionChannelIds, suggestionCooldownMs                                                              |
| Minecraft Monitoring | `/config-minecraft`   | pingEnabled, mcServers                                                                                  |
| Moderation Log       | `/config-modlog`      | modLogChannelId                                                                                         |

## Security

- OAuth2 authentication with Discord
- Session-based auth stored in MongoDB
- Guild permission checks (MANAGE_GUILD or ADMINISTRATOR required)
- Rate limiting (100 req/min)
- Helmet security headers
- CORS restricted to dashboard origin
- Input validation on all write endpoints
