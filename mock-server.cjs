/**
 * Lightweight mock API server for visual testing of the dashboard.
 * Run: node mock-server.js
 * Serves on port 8080 — matching Vite proxy target.
 */
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ── CSRF ──────────────────────────────────────────────────────
app.get('/api/csrf-token', (_req, res) => res.json({ token: 'mock-csrf' }));

// ── Auth ──────────────────────────────────────────────────────
app.head('/api/auth', (_req, res) => res.sendStatus(200));
app.get('/api/auth', (_req, res) => res.sendStatus(200));
app.post('/api/auth/signout', (_req, res) => res.send('ok'));

// ── User ──────────────────────────────────────────────────────
app.get('/api/users/@me', (_req, res) => res.json({
  id: '123456789012345678',
  username: 'TestUser',
  avatar: null,
  discriminator: '0',
  global_name: 'Test User',
}));

app.get('/api/users/preferences', (_req, res) => res.json({
  colorScheme: 'system',
  accentColor: 'brand',
  language: 'en',
  sidebarCollapsed: false,
}));
app.patch('/api/users/preferences', (req, res) => res.json(req.body));

// ── Guilds ────────────────────────────────────────────────────
const GUILD_ID = '987654321098765432';
const mockGuild = {
  id: GUILD_ID,
  name: 'Mock Server',
  icon: null,
  owner: true,
  permissions: 2147483647,
};

app.get('/api/guilds', (_req, res) => res.json([{ ...mockGuild, exist: true }]));
app.get('/api/guild/:id', (req, res) => res.json({ ...mockGuild, id: req.params.id }));

// ── Server Detail ─────────────────────────────────────────────
app.get('/api/guild/:id/detail', (_req, res) => res.json({
  members: 1247,
  online: 342,
  welcomeEnabled: true,
  xpEnabled: true,
  suggestionsEnabled: false,
  mcServers: 2,
  modLogEnabled: true,
}));

app.get('/api/guild/:id/detail/advanced', (_req, res) => res.json({
  xp: {
    totalTrackedUsers: 856,
    leaderboard: [
      { rank: 1, userName: 'Alice', level: 42, xp: 98200 },
      { rank: 2, userName: 'Bob', level: 38, xp: 87100 },
      { rank: 3, userName: 'Charlie', level: 35, xp: 76500 },
      { rank: 4, userName: 'Diana', level: 31, xp: 64300 },
      { rank: 5, userName: 'Eve', level: 28, xp: 52100 },
    ],
  },
  suggestions: { total: 143, pending: 12 },
  moderation: {
    totalActions: 567,
    recentActions: [
      { action: 'Ban', targetId: 'user1', moderatorId: 'mod1', reason: 'Spam', createdAt: '2026-03-05T10:00:00Z' },
      { action: 'Mute', targetId: 'user2', moderatorId: 'mod1', reason: 'Toxicity', createdAt: '2026-03-04T15:30:00Z' },
      { action: 'Warn', targetId: 'user3', moderatorId: 'mod2', reason: 'Off-topic', createdAt: '2026-03-03T09:15:00Z' },
      { action: 'Kick', targetId: 'user4', moderatorId: 'mod1', reason: 'Repeated violations', createdAt: '2026-03-02T22:00:00Z' },
      { action: 'Warn', targetId: 'user5', moderatorId: 'mod2', reason: 'Inappropriate language', createdAt: '2026-03-01T14:45:00Z' },
    ],
  },
}));

// ── Features ──────────────────────────────────────────────────
const FEATURES = ['welcome', 'xp', 'suggestions', 'minecraft', 'modlog',
  'reaction_roles', 'automod', 'starboard', 'tickets', 'custom_commands',
  'announcements', 'temp_roles', 'giveaways'];

app.get('/api/guild/:id/features', (_req, res) => res.json({
  enabled: ['welcome', 'xp', 'modlog', 'automod'],
  data: {},
}));

app.get('/api/guild/:id/feature/:featureId', (req, res) => res.json({ values: {} }));
app.patch('/api/guild/:id/feature/:featureId', (req, res) => res.json(req.body));
app.patch('/api/guild/:id/feature/:featureId/enabled', (req, res) => res.json(req.body));

// ── Settings ──────────────────────────────────────────────────
app.get('/api/guild/:id/settings', (_req, res) => res.json({ values: { language: 'en' } }));
app.patch('/api/guild/:id/settings', (req, res) => res.json(req.body));

// ── Notifications ─────────────────────────────────────────────
app.get('/api/guild/:id/notification', (_req, res) => res.json([
  { id: 1, type: 'info', title: 'System update applied', message: 'v0.3.4 deployed successfully', createdAt: '2026-03-06T08:00:00Z' },
  { id: 2, type: 'warning', title: 'Rate limit reached', message: 'Discord API rate limit hit temporarily', createdAt: '2026-03-05T20:00:00Z' },
]));

// ── Audit Log ─────────────────────────────────────────────────
app.get('/api/guild/:id/audit-log', (_req, res) => res.json({
  entries: [
    { id: 1, action: 'feature.enable', category: 'features', actorId: '123', details: 'Enabled welcome', createdAt: '2026-03-06T10:00:00Z' },
    { id: 2, action: 'settings.update', category: 'settings', actorId: '123', details: 'Changed language', createdAt: '2026-03-05T16:00:00Z' },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
}));

// ── Analytics ─────────────────────────────────────────────────
app.get('/api/guild/:id/analytics', (_req, res) => res.json({
  memberGrowth: [
    { date: '2026-02-28', count: 1180 },
    { date: '2026-03-01', count: 1195 },
    { date: '2026-03-02', count: 1210 },
    { date: '2026-03-03', count: 1220 },
    { date: '2026-03-04', count: 1230 },
    { date: '2026-03-05', count: 1240 },
    { date: '2026-03-06', count: 1247 },
  ],
  messageActivity: [
    { date: '2026-02-28', count: 342 },
    { date: '2026-03-01', count: 456 },
    { date: '2026-03-02', count: 389 },
    { date: '2026-03-03', count: 512 },
    { date: '2026-03-04', count: 445 },
    { date: '2026-03-05', count: 378 },
    { date: '2026-03-06', count: 290 },
  ],
  topChannels: [
    { name: 'general', messages: 1245 },
    { name: 'off-topic', messages: 876 },
    { name: 'gaming', messages: 654 },
  ],
}));

// ── Leaderboard ───────────────────────────────────────────────
app.get('/api/guild/:id/leaderboard', (_req, res) => res.json({
  entries: Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    userId: `user${i}`,
    username: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack'][i],
    level: 42 - i * 3,
    xp: 98200 - i * 8500,
    avatar: null,
  })),
  total: 50,
  page: 1,
  totalPages: 5,
}));

// ── Actions ───────────────────────────────────────────────────
app.get('/api/guild/:id/actions', (_req, res) => res.json({ actions: [] }));
app.get('/api/guild/:id/action/:actionId', (_req, res) => res.json({ tasks: [], total: 0, page: 1, totalPages: 1 }));

// ── Start ─────────────────────────────────────────────────────
app.listen(8080, () => console.log('Mock API server running on http://localhost:8080'));
