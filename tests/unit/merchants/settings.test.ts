import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/config/env', () => ({
  env: { NODE_ENV: 'test', PORT: 3000, DATABASE_URL: 'postgresql://test', REDIS_URL: 'redis://test' },
}));
vi.mock('../../../src/config/database', () => ({ db: { query: vi.fn() } }));

import { isWithinBusinessHours } from '../../../src/merchants/settings';

describe('isWithinBusinessHours', () => {
  it('returns true when no hours set', () => {
    expect(isWithinBusinessHours(undefined)).toBe(true);
  });

  it('returns true for unparseable format', () => {
    expect(isWithinBusinessHours('Always open')).toBe(true);
  });

  it('parses Mon-Sat 8AM-6PM format', () => {
    // Just ensure it returns a boolean without throwing
    const result = isWithinBusinessHours('Mon-Sat 8AM-6PM');
    expect(typeof result).toBe('boolean');
  });

  it('parses Mon-Sun 9AM-7PM format', () => {
    const result = isWithinBusinessHours('Mon-Sun 9AM-7PM');
    expect(typeof result).toBe('boolean');
  });
});
