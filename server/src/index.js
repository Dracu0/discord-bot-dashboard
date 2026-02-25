require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const configurePassport = require('./auth/passport');
const authRoutes = require('./routes/auth');
const guildRoutes = require('./routes/guild');
const userRoutes = require('./routes/users');

const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_BOT_TOKEN,
    DATABASE_TOKEN,
    PORT = 8080,
    SESSION_SECRET,
    DASHBOARD_URL = 'http://localhost:3000',
    CALLBACK_URL = 'http://localhost:8080/auth/discord/callback',
} = process.env;

// Validate environment
if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET || !DISCORD_BOT_TOKEN || !DATABASE_TOKEN || !SESSION_SECRET) {
    console.error('FATAL: Missing required environment variables. See .env.example');
    process.exit(1);
}

const app = express();

// Security
app.use(helmet());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// CORS - allow dashboard frontend
app.use(cors({
    origin: DASHBOARD_URL,
    credentials: true,
}));

app.use(express.json());

// Connect to MongoDB (same DB as the bot)
mongoose.connect(DATABASE_TOKEN, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
}).then(() => {
    console.log('Dashboard server connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Session store in MongoDB
app.use(session({
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
        secure: process.env.NODE_ENV === 'production',
    },
}));

// Passport (Discord OAuth2)
configurePassport(passport, {
    clientID: DISCORD_CLIENT_ID,
    clientSecret: DISCORD_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
});
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/guild', guildRoutes);
app.use('/guilds', userRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});

// Error handler
app.use((err, req, res, _next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Dashboard API server running on port ${PORT}`);
});
