const { z } = require('zod');
const { badRequest } = require('../utils/apiError');

const guildFeatureIdSchema = z.string().min(1).max(64);

const toggleBodySchema = z.object({
    enabled: z.boolean(),
});

const reorderBodySchema = z.object({
    itemIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).min(1),
});

function parseOrApiError(schema, payload, message = 'Invalid request payload') {
    const parsed = schema.safeParse(payload);
    if (parsed.success) return parsed.data;

    throw badRequest(message, {
        issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            code: issue.code,
            message: issue.message,
        })),
    });
}

module.exports = {
    z,
    guildFeatureIdSchema,
    toggleBodySchema,
    reorderBodySchema,
    parseOrApiError,
};
