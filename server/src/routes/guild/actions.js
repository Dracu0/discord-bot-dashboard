const router = require('express').Router({ mergeParams: true });
const { randomUUID } = require('crypto');
const ModLog = require('../../models/ModLog');
const Suggestion = require('../../models/Suggestion');
const { isObject, isValidObjectId, VALID_SUGGESTION_STATUSES } = require('./helpers');

// GET /guild/:id/actions
router.get('/', async (req, res) => {
    try {
        const guildId = req.params.id;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const [modLogs, totalModLogs, suggestions, totalSuggestions] = await Promise.all([
            ModLog.find({ guildId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            ModLog.countDocuments({ guildId }),
            Suggestion.find({ guildId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Suggestion.countDocuments({ guildId }),
        ]);

        res.json({
            modLogs: modLogs.map(l => ({
                id: l._id,
                action: l.action,
                targetId: l.targetId,
                moderatorId: l.moderatorId,
                reason: l.reason,
                duration: l.duration,
                createdAt: l.createdAt,
            })),
            suggestions: suggestions.map(s => ({
                id: s.suggestionId,
                content: s.content,
                status: s.status,
                authorId: s.authorId,
                upvotes: s.upvotes.length,
                downvotes: s.downvotes.length,
                createdAt: s.createdAt,
            })),
            page,
            totalModLogs,
            totalSuggestions,
            totalPages: Math.ceil(Math.max(totalModLogs, totalSuggestions) / limit),
        });
    } catch (err) {
        req.log?.error('actions_fetch_failed', { guildId: req.params.id, error: err });
        res.status(500).json({ error: 'Failed to fetch actions data' });
    }
});

// GET /guild/:id/action/:actionId
router.get('/:actionId', async (req, res) => {
    try {
        const { id: guildId, actionId } = req.params;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        if (actionId === 'manage_suggestions') {
            const [suggestions, total] = await Promise.all([
                Suggestion.find({ guildId })
                    .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
                Suggestion.countDocuments({ guildId }),
            ]);

            res.json({
                tasks: suggestions.map(s => ({
                    id: s.suggestionId,
                    name: s.content.substring(0, 50),
                    status: s.status,
                    createdAt: s.createdAt,
                })),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } else if (actionId === 'mod_history') {
            const [logs, total] = await Promise.all([
                ModLog.find({ guildId })
                    .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
                ModLog.countDocuments({ guildId }),
            ]);

            res.json({
                tasks: logs.map(l => ({
                    id: l._id.toString(),
                    name: `${l.action} - ${l.targetId} by ${l.moderatorId}`,
                    status: l.action,
                    createdAt: l.createdAt,
                })),
                total,
                page,
                totalPages: Math.ceil(total / limit),
            });
        } else {
            res.status(404).json({ error: 'Unknown action' });
        }
    } catch (err) {
        req.log?.error('action_detail_fetch_failed', { guildId: req.params.id, actionId: req.params.actionId, error: err });
        res.status(500).json({ error: 'Failed to fetch action detail' });
    }
});

// GET /guild/:id/action/:actionId/:taskId
router.get('/:actionId/:taskId', async (req, res) => {
    try {
        const { id: guildId, actionId, taskId } = req.params;

        if (actionId === 'manage_suggestions') {
            const suggestion = await Suggestion.findOne({
                guildId,
                suggestionId: taskId,
            }).lean();

            if (!suggestion) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            res.json({
                id: suggestion.suggestionId,
                name: suggestion.content.substring(0, 50),
                createdAt: suggestion.createdAt,
                values: {
                    content: suggestion.content,
                    status: suggestion.status,
                    reason: suggestion.reason,
                    authorId: suggestion.authorId,
                    upvotes: suggestion.upvotes.length,
                    downvotes: suggestion.downvotes.length,
                },
            });
        } else if (actionId === 'mod_history') {
            if (!isValidObjectId(taskId)) {
                return res.status(400).json({ error: 'Invalid task ID format' });
            }
            const log = await ModLog.findById(taskId).lean();

            if (!log || log.guildId !== guildId) {
                return res.status(404).json({ error: 'Log entry not found' });
            }

            res.json({
                id: log._id.toString(),
                name: `${log.action} - ${log.targetId} by ${log.moderatorId}`,
                createdAt: log.createdAt,
                values: {
                    action: log.action,
                    targetId: log.targetId,
                    moderatorId: log.moderatorId,
                    reason: log.reason,
                    duration: log.duration,
                },
            });
        } else {
            res.status(404).json({ error: 'Unknown action' });
        }
    } catch (err) {
        req.log?.error('task_detail_fetch_failed', {
            guildId: req.params.id,
            actionId: req.params.actionId,
            taskId: req.params.taskId,
            error: err,
        });
        res.status(500).json({ error: 'Failed to fetch task detail' });
    }
});

// PATCH /guild/:id/action/:actionId/:taskId
router.patch('/:actionId/:taskId', async (req, res) => {
    try {
        const { id: guildId, actionId, taskId } = req.params;

        if (!isObject(req.body) || !isObject(req.body.options)) {
            return res.status(400).json({ error: 'Body must contain { options: {} }' });
        }
        const { options } = req.body;

        if (actionId === 'manage_suggestions') {
            const suggestion = await Suggestion.findOne({
                guildId,
                suggestionId: taskId,
            });

            if (!suggestion) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            if (options.status) {
                if (!VALID_SUGGESTION_STATUSES.includes(options.status)) {
                    return res.status(400).json({ error: 'Invalid status value' });
                }
                suggestion.status = options.status;
            }
            if (options.reason !== undefined) {
                if (typeof options.reason !== 'string' || options.reason.length > 2000) {
                    return res.status(400).json({ error: 'Reason must be a string (max 2000 chars)' });
                }
                suggestion.reason = options.reason;
            }
            await suggestion.save();

            req.log?.info('action_task_updated', {
                guildId,
                actionId,
                taskId,
                actorId: req.user?.id || null,
                updatedKeys: Object.keys(options),
            });

            res.json({
                id: suggestion.suggestionId,
                name: suggestion.content.substring(0, 50),
                createdAt: suggestion.createdAt,
                values: {
                    content: suggestion.content,
                    status: suggestion.status,
                    reason: suggestion.reason,
                },
            });
        } else {
            res.status(404).json({ error: 'Action does not support updates' });
        }
    } catch (err) {
        req.log?.error('action_task_update_failed', {
            guildId: req.params.id,
            actionId: req.params.actionId,
            taskId: req.params.taskId,
            error: err,
        });
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// POST /guild/:id/action/:actionId
router.post('/:actionId', async (req, res) => {
    try {
        const { id: guildId, actionId } = req.params;

        if (!isObject(req.body)) {
            return res.status(400).json({ error: 'Body must be a JSON object' });
        }
        const { name, options } = req.body;

        if (actionId === 'manage_suggestions') {
            if (!isObject(options)) {
                return res.status(400).json({ error: 'Body must contain { options: {} }' });
            }
            const content = options.content || name || '';
            if (!content || typeof content !== 'string' || content.length > 4000) {
                return res.status(400).json({ error: 'Content is required (max 4000 chars)' });
            }
            if (options.status && !VALID_SUGGESTION_STATUSES.includes(options.status)) {
                return res.status(400).json({ error: 'Invalid status value' });
            }
            const suggestion = await Suggestion.create({
                guildId,
                authorId: req.user.id,
                messageId: `dashboard-${randomUUID()}`,
                content,
                status: options.status || 'pending',
                reason: typeof options.reason === 'string' ? options.reason.slice(0, 2000) : '',
            });

            req.log?.info('action_task_created', {
                guildId,
                actionId,
                taskId: suggestion.suggestionId,
                actorId: req.user?.id || null,
            });

            res.json({
                id: suggestion.suggestionId,
                name: suggestion.content.substring(0, 50),
                createdAt: suggestion.createdAt,
                values: {
                    content: suggestion.content,
                    status: suggestion.status,
                    reason: suggestion.reason,
                },
            });
        } else {
            res.status(404).json({ error: 'Action does not support creation' });
        }
    } catch (err) {
        req.log?.error('action_task_create_failed', { guildId: req.params.id, actionId: req.params.actionId, error: err });
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// DELETE /guild/:id/action/:actionId/:taskId
router.delete('/:actionId/:taskId', async (req, res) => {
    try {
        const { id: guildId, actionId, taskId } = req.params;

        if (actionId === 'manage_suggestions') {
            const result = await Suggestion.findOneAndDelete({
                guildId,
                suggestionId: taskId,
            });

            if (!result) {
                return res.status(404).json({ error: 'Suggestion not found' });
            }

            req.log?.info('action_task_deleted', {
                guildId,
                actionId,
                taskId,
                actorId: req.user?.id || null,
            });

            res.sendStatus(200);
        } else if (actionId === 'mod_history') {
            if (!isValidObjectId(taskId)) {
                return res.status(400).json({ error: 'Invalid task ID format' });
            }
            const log = await ModLog.findById(taskId).lean();

            if (!log || log.guildId !== guildId) {
                return res.status(404).json({ error: 'Log entry not found' });
            }

            await ModLog.findByIdAndDelete(taskId);
            req.log?.info('modlog_entry_deleted', {
                guildId,
                actionId,
                taskId,
                actorId: req.user?.id || null,
            });
            res.sendStatus(200);
        } else {
            res.status(404).json({ error: 'Unknown action' });
        }
    } catch (err) {
        req.log?.error('action_task_delete_failed', {
            guildId: req.params.id,
            actionId: req.params.actionId,
            taskId: req.params.taskId,
            error: err,
        });
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
