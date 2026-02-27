const router = require('express').Router();
const { requireGuildAccess } = require('../../auth/middleware');

const infoRoutes = require('./info');
const featureRoutes = require('./features');
const settingsRoutes = require('./settings');
const actionRoutes = require('./actions');

// All guild routes require access
router.use('/:id', requireGuildAccess);

// Mount sub-routers (order matters — more specific paths first)
router.use('/:id/features', featureRoutes);
router.use('/:id/feature', featureRoutes);
router.use('/:id/settings', settingsRoutes);
router.use('/:id/actions', actionRoutes);
router.use('/:id/action', actionRoutes);
router.use('/:id', infoRoutes);

module.exports = router;
