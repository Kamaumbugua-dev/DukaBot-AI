import { describe, it, expect } from 'vitest';
import { formatKES, normalizePhone, generateRef, truncateText } from '../../../src/shared/utils';

describe('formatKES', () => {
  it('formats 45000 as KES 45,000', () => {
    expect(formatKES(45000)).toBe('KES 45,000');
  });

  it('formats 0 as KES 0', () => {
    expect(formatKES(0)).toBe('KES 0');
  });

  it('formats decimal amounts', () => {
    expect(formatKES(1500.5)).toContain('1,500');
  });
});

describe('normalizePhone', () => {
  it('normalizes 0712345678 to 254712345678', () => {
    expect(normalizePhone('0712345678')).toBe('254712345678');
  });

  it('normalizes +254712345678 to 254712345678', () => {
    expect(normalizePhone('+254712345678')).toBe('254712345678');
  });

  it('leaves 254712345678 unchanged', () => {
    expect(normalizePhone('254712345678')).toBe('254712345678');
  });
});

describe('generateRef', () => {
  it('returns 12-char alphanumeric string by default', () => {
    const ref = generateRef();
    expect(ref).toHaveLength(12);
    expect(ref).toMatch(/^[A-Z0-9]+$/);
  });

  it('returns custom length', () => {
    expect(generateRef(6)).toHaveLength(6);
  });
});

describe('truncateText', () => {
  it('returns text as-is when within limit', () => {
    expect(truncateText('hello', 10)).toBe('hello');
  });

  it('truncates at word boundary', () => {
    const result = truncateText('hello world foo', 11);
    expect(result).toContain('hello');
    expect(result.length).toBeLessThanOrEqual(13); // allows for ellipsis
  });
});
