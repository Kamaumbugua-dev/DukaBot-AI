import { describe, it, expect, vi } from 'vitest';
import { normalizePhone } from '../../../src/shared/utils';
import { parseCallback } from '../../../src/commerce/mpesa';
import stkSuccess from '../../fixtures/mpesa/stk-success.json';
import stkFailed from '../../fixtures/mpesa/stk-failed.json';

// Mock env and redis
vi.mock('../../../src/config/env', () => ({
  env: {
    MPESA_ENV: 'sandbox',
    MPESA_CONSUMER_KEY: 'test',
    MPESA_CONSUMER_SECRET: 'test',
    MPESA_SHORTCODE: '174379',
    MPESA_PASSKEY: 'test-passkey',
    MPESA_CALLBACK_URL: 'https://example.com/mpesa/callback',
  },
}));

vi.mock('../../../src/config/redis', () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    setEx: vi.fn().mockResolvedValue('OK'),
  },
}));

describe('normalizePhone', () => {
  it('normalizes 0712345678 → 254712345678', () => {
    expect(normalizePhone('0712345678')).toBe('254712345678');
  });

  it('normalizes +254712345678 → 254712345678', () => {
    expect(normalizePhone('+254712345678')).toBe('254712345678');
  });

  it('leaves 254712345678 unchanged', () => {
    expect(normalizePhone('254712345678')).toBe('254712345678');
  });
});

describe('parseCallback', () => {
  it('parses successful callback payload', () => {
    const result = parseCallback(stkSuccess);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.success).toBe(true);
      expect(result.data.mpesaReceipt).toBe('QKJ4H7RTXL');
      expect(result.data.amount).toBe(38500);
    }
  });

  it('parses failed callback payload', () => {
    const result = parseCallback(stkFailed);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.success).toBe(false);
      expect(result.data.checkoutRequestId).toBe('ws_CO_191220191020363926');
    }
  });

  it('handles missing CallbackMetadata gracefully', () => {
    const noMeta = {
      Body: {
        stkCallback: {
          MerchantRequestID: 'req-1',
          CheckoutRequestID: 'chk-1',
          ResultCode: 0,
          ResultDesc: 'Success',
        },
      },
    };
    const result = parseCallback(noMeta);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.success).toBe(true);
      expect(result.data.mpesaReceipt).toBe('');
    }
  });

  it('rejects invalid callback payload', () => {
    const result = parseCallback({ invalid: 'data' });
    expect(result.ok).toBe(false);
  });
});
