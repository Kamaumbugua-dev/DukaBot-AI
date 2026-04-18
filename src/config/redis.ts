import { createClient } from 'redis';
import { env } from './env';
import { logger } from '../shared/logger';

export const redis = createClient({ url: env.REDIS_URL });

redis.on('error', (err) => {
  logger.error({ err }, 'Redis client error');
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

export async function connectRedis(): Promise<void> {
  await redis.connect();
}

export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (err) {
    logger.error({ err }, 'Redis connection check failed');
    return false;
  }
}
