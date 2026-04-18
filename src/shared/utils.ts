import { randomBytes } from 'crypto';

/** Format a KES amount with comma separators */
export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

/** Normalize Kenyan phone number to 254XXXXXXXXX format */
export function normalizePhone(phone: string): string {
  return phone.replace(/^(\+?254|0)/, '254');
}

/** Generate a random alphanumeric reference (12 chars by default) */
export function generateRef(length = 12): string {
  return randomBytes(length)
    .toString('base64')
    .replace(/[^A-Z0-9]/gi, '')
    .slice(0, length)
    .toUpperCase();
}

/** Truncate text at word boundary */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/** Sleep for ms milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Exponential backoff: delay = base * 2^attempt (capped at max) */
export function backoffDelay(attempt: number, base = 500, max = 10_000): number {
  return Math.min(base * Math.pow(2, attempt), max);
}
