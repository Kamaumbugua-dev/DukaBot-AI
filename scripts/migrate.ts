import 'dotenv/config';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { db } from '../src/config/database';
import { logger } from '../src/shared/logger';

async function migrate() {
  // Create migrations tracking table
  await db.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(200) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const migrationsDir = join(process.cwd(), 'migrations');
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const { rows: applied } = await db.query<{ filename: string }>(
    'SELECT filename FROM migrations',
  );
  const appliedSet = new Set(applied.map((r) => r.filename));

  let count = 0;
  for (const file of files) {
    if (appliedSet.has(file)) {
      logger.info({ file }, 'Migration already applied — skipping');
      continue;
    }

    const sql = await readFile(join(migrationsDir, file), 'utf-8');
    await db.query(sql);
    await db.query('INSERT INTO migrations (filename) VALUES ($1)', [file]);

    logger.info({ file }, 'Migration applied');
    count++;
  }

  logger.info({ count }, 'Migrations complete');
  await db.end();
}

migrate().catch((err) => {
  logger.error({ err }, 'Migration failed');
  process.exit(1);
});
