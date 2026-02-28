const Redis = require('ioredis');
const logger = require('./logger');

let redis = null;
let subscriber = null;

function getRedis() {
    if (!redis && process.env.REDIS_URL) {
        redis = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                return Math.min(times * 500, 5000);
            },
            lazyConnect: false,
        });
        redis.on('error', (err) => logger.warn('redis_error', { error: err.message }));
        redis.on('connect', () => logger.info('redis_connected'));
    }
    return redis;
}

function getSubscriber() {
    if (!subscriber && process.env.REDIS_URL) {
        subscriber = new Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                return Math.min(times * 500, 5000);
            },
            lazyConnect: false,
        });
        subscriber.on('error', (err) => logger.warn('redis_subscriber_error', { error: err.message }));
    }
    return subscriber;
}

/**
 * Publish a config invalidation event so the bot clears its cache for this guild.
 */
async function publishConfigInvalidation(guildId) {
    const r = getRedis();
    if (!r) return;
    try {
        await r.publish('config:invalidate', guildId);
    } catch (err) {
        logger.warn('config_invalidation_publish_failed', { guildId, error: err.message });
    }
}

async function closeRedis() {
    const promises = [];
    if (redis) { promises.push(redis.quit()); redis = null; }
    if (subscriber) { promises.push(subscriber.quit()); subscriber = null; }
    await Promise.allSettled(promises);
}

module.exports = { getRedis, getSubscriber, publishConfigInvalidation, closeRedis };
