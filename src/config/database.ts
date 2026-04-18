import { Pool } from 'pg';
import { env } from './env';
import { logger } from '../shared/logger';

export const db = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

db.on('error', (err) => {
  logger.error({ err }, 'PostgreSQL pool error');
});

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await db.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    logger.error({ err }, 'Database connection check failed');
    return false;
  }
}
