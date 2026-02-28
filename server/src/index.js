require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('./utils/logger');
const { requestContext } = require('./middleware/requestContext');
const { csrfProtection, generateCsrfToken } = require('./middleware/csrf');
const { startWebSocketServer, stopWebSocketServer } = require('./utils/websocket');
const { closeRedis } = require('./utils/redis');

const configurePassport = require('./auth/passport');
const authRoutes = require('./routes/auth');
const guildRoutes = require('./routes/guild');
const userRoutes = require('./routes/users');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_BOT_TOKEN,
    DATABASE_TOKEN,
    PORT = 8080,
    SESSION_SECRET,
    DASHBOARD_URL = IS_PRODUCTION ? '' : 'http://localhost:3000',
    CALLBACK_URL = IS_PRODUCTION ? '/api/auth/discord/callback' : 'http://localhost:8080/api/auth/discord/callback',
    APP_URL, // e.g. https://my-dashboard.fly.dev — set in Fly.io secrets
} = process.env;

// In production, derive the dashboard URL from APP_URL if not explicitly set
const dashboardOrigin = DASHBOARD_URL || APP_URL || `http://localhost:${PORT}`;
// Build the full callback URL for Discord OAuth2
const fullCallbackURL = CALLBACK_URL.startsWith('http')
    ? CALLBACK_URL
    : `${APP_URL || `http://localhost:${PORT}`}${CALLBACK_URL}`;

// Validate environment
if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_BOT_TOKEN || !DATABASE_TOKEN || !SESSION_SECRET) {
    logger.error('missing_required_env_vars', {
        missing: {
            DISCORD_CLIENT_ID: !DISCORD_CLIENT_ID,
            DISCORD_CLIENT_SECRET: !DISCORD_CLIENT_SECRET,
            DISCORD_BOT_TOKEN: !DISCORD_BOT_TOKEN,
            DATABASE_TOKEN: !DATABASE_TOKEN,
            SESSION_SECRET: !SESSION_SECRET,
        },
    });
    process.exit(1);
}

const app = express();

// Trust Fly.io proxy (required for secure cookies, rate limiting, etc.)
if (IS_PRODUCTION) {
    app.set('trust proxy', 1);
}

// Security — CSP headers (unsafe-inline required for style-src because Mantine v7 injects inline styles at runtime)
app.use(helmet({
    contentSecurityPolicy: IS_PRODUCTION ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://cdn.discordapp.com"],
            connectSrc: ["'self'", "wss:"],
        },
    } : false,
}));

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth', limiter);
app.use('/api/guild', limiter);
app.use('/api/guilds', limiter);
app.use('/api/users', limiter);

// CORS — only needed in development (separate origins)
if (!IS_PRODUCTION) {
    app.use(cors({
        origin: dashboardOrigin,
        credentials: true,
    }));
}

app.use(express.json());
app.use(requestContext);

// Connect to MongoDB (same DB as the bot) with retry
const MAX_DB_RETRIES = 3;
async function connectWithRetry() {
    for (let attempt = 1; attempt <= MAX_DB_RETRIES; attempt++) {
        try {
            await mongoose.connect(DATABASE_TOKEN, {
                serverSelectionTimeoutMS: 10000,
                maxPoolSize: 10,
            });
            logger.info('mongodb_connected');
            return;
        } catch (err) {
            if (attempt < MAX_DB_RETRIES) {
                const delay = 2000 * attempt;
                logger.warn('mongodb_connect_retry', { attempt, maxRetries: MAX_DB_RETRIES, delayMs: delay, error: err });
                await new Promise(r => setTimeout(r, delay));
            } else {
                logger.error('mongodb_connect_failed', { attempt, maxRetries: MAX_DB_RETRIES, error: err });
                process.exit(1);
            }
        }
    }
}
connectWithRetry();

// Session store in MongoDB
const sessionMiddleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(),
        collectionName: 'dashboard_sessions',
        ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: IS_PRODUCTION,
    },
});
app.use(sessionMiddleware);

// Passport (Discord OAuth2)
configurePassport(passport, {
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: fullCallbackURL,
});
app.use(passport.initialize());
app.use(passport.session());

// CSRF token endpoint — clients GET this before making state-changing requests
app.get('/api/csrf-token', generateCsrfToken);

// Apply CSRF protection to all state-changing API routes
app.use('/api/auth', csrfProtection, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guild', csrfProtection, guildRoutes);
app.use('/api/guilds', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// --- Production: serve React build ---
if (IS_PRODUCTION) {
    const buildPath = path.join(__dirname, '../../build');
    app.use(express.static(buildPath));

    // SPA catch-all: any non-API route serves index.html (React Router handles client routing)
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

// Error handler
app.use((err, req, res, _next) => {
    const log = req?.log || logger;
    log.error('unhandled_server_error', { error: err });
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
});

// Bind to 0.0.0.0 so Fly.io proxy can reach the container (not just localhost)
const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info('server_started', {
        port: Number(PORT),
        mode: IS_PRODUCTION ? 'production' : 'development',
    });

    // Attach WebSocket server
    startWebSocketServer(server, sessionMiddleware);
});

// Graceful shutdown
let shuttingDown = false;
function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info('shutdown_signal_received', { signal });

    const forceExit = setTimeout(() => {
        logger.error('shutdown_timeout_forced_exit', { timeoutMs: 30000 });
        process.exit(1);
    }, 30000);
    forceExit.unref();

    server.close(async () => {
        try {
            stopWebSocketServer();
            await closeRedis();
            await mongoose.connection.close();
        } catch (err) {
            logger.error('db_close_error', { error: err });
        }
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
