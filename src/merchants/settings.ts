import { db } from '../config/database';
import { logger } from '../shared/logger';
import { AppError } from '../shared/errors';
import type { MerchantSettings } from '../types/commerce';

type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

export async function getMerchantSettings(merchantId: string): Promise<Result<MerchantSettings>> {
  try {
    const { rows } = await db.query<{ settings: MerchantSettings }>(
      'SELECT settings FROM merchants WHERE id = $1',
      [merchantId],
    );
    const row = rows[0];
    if (!row) return { ok: false, error: new AppError('Merchant not found', 'NOT_FOUND', 404) };
    return { ok: true, data: row.settings };
  } catch (err) {
    logger.error({ err }, 'getMerchantSettings failed');
    return { ok: false, error: new AppError('Settings fetch failed', 'SETTINGS_ERROR') };
  }
}

export async function updateMerchantSettings(
  merchantId: string,
  updates: Partial<MerchantSettings>,
): Promise<Result<MerchantSettings>> {
  try {
    const { rows } = await db.query<{ settings: MerchantSettings }>(
      `UPDATE merchants
       SET settings   = settings || $2::jsonb,
           updated_at = NOW()
       WHERE id = $1
       RETURNING settings`,
      [merchantId, JSON.stringify(updates)],
    );
    const row = rows[0];
    if (!row) return { ok: false, error: new AppError('Merchant not found', 'NOT_FOUND', 404) };
    logger.info({ merchantId }, 'Merchant settings updated');
    return { ok: true, data: row.settings };
  } catch (err) {
    logger.error({ err }, 'updateMerchantSettings failed');
    return { ok: false, error: new AppError('Settings update failed', 'SETTINGS_ERROR') };
  }
}

export function isWithinBusinessHours(businessHours?: string): boolean {
  if (!businessHours) return true; // default: always open

  // Parse simple format: "Mon-Sat 8AM-6PM"
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();

  // Basic parser for "Mon-Sat 8AM-6PM" or "Mon-Sun 9AM-7PM"
  const match = businessHours.match(/(\w+)-(\w+)\s+(\d+)(AM|PM)-(\d+)(AM|PM)/i);
  if (!match) return true;

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDayName = match[1] ?? 'Mon';
  const endDayName = match[2] ?? 'Sat';
  const startDay = dayNames.indexOf(startDayName);
  const endDay = dayNames.indexOf(endDayName);

  const openHour = parseInt(match[3] ?? '8') + (match[4]?.toUpperCase() === 'PM' && parseInt(match[3] ?? '8') !== 12 ? 12 : 0);
  const closeHour = parseInt(match[5] ?? '18') + (match[6]?.toUpperCase() === 'PM' && parseInt(match[5] ?? '6') !== 12 ? 12 : 0);

  const withinDays = startDay <= endDay
    ? day >= startDay && day <= endDay
    : day >= startDay || day <= endDay;

  const withinHours = hour >= openHour && hour < closeHour;

  return withinDays && withinHours;
}
