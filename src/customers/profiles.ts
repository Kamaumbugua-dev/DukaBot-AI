import { db } from '../config/database';
import { logger } from '../shared/logger';
import { AppError } from '../shared/errors';
import type { Customer } from '../types/commerce';

type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

type DbCustomer = {
  id: string;
  phone: string;
  name?: string;
  preferences: Record<string, unknown>;
  created_at: Date;
};

function mapCustomer(row: DbCustomer): Customer {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    preferences: row.preferences,
    createdAt: row.created_at,
  };
}

export async function getOrCreateCustomer(phone: string): Promise<Result<Customer>> {
  try {
    // Try to find existing
    const { rows } = await db.query<DbCustomer>(
      'SELECT * FROM customers WHERE phone = $1',
      [phone],
    );

    if (rows[0]) {
      return { ok: true, data: mapCustomer(rows[0]) };
    }

    // Auto-create on first message
    const { rows: created } = await db.query<DbCustomer>(
      'INSERT INTO customers (phone) VALUES ($1) RETURNING *',
      [phone],
    );

    const row = created[0];
    if (!row) {
      return { ok: false, error: new AppError('Failed to create customer', 'CUSTOMER_CREATE_ERROR') };
    }

    logger.info('New customer created');
    return { ok: true, data: mapCustomer(row) };
  } catch (err) {
    logger.error({ err }, 'getOrCreateCustomer failed');
    return { ok: false, error: new AppError('Customer lookup failed', 'CUSTOMER_ERROR') };
  }
}
