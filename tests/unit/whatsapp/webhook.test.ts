import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHmac } from 'crypto';
import { validateWebhookSignature, parseWebhookPayload } from '../../../src/whatsapp/webhook';
import textMessage from '../../fixtures/whatsapp/text-message.json';
import interactiveReply from '../../fixtures/whatsapp/interactive-reply.json';
import statusUpdate from '../../fixtures/whatsapp/status-update.json';

// Mock env so tests don't require real env vars
vi.mock('../../../src/config/env', () => ({
  env: {
    WHATSAPP_APP_SECRET: 'test-secret',
    WHATSAPP_VERIFY_TOKEN: 'test-verify-token',
    WHATSAPP_TOKEN: 'test-token',
    WHATSAPP_PHONE_ID: 'test-phone-id',
    NODE_ENV: 'test',
    PORT: 3000,
    DATABASE_URL: 'postgresql://test',
    REDIS_URL: 'redis://test',
    ANTHROPIC_API_KEY: 'test',
    CLAUDE_MODEL: 'claude-sonnet-4-20250514',
    CLAUDE_MODEL_COMPLEX: 'claude-opus-4-6',
    MPESA_CONSUMER_KEY: 'test',
    MPESA_CONSUMER_SECRET: 'test',
    MPESA_SHORTCODE: '174379',
    MPESA_PASSKEY: 'test',
    MPESA_ENV: 'sandbox',
    MPESA_CALLBACK_URL: 'https://example.com/mpesa/callback',
  },
}));

function makeSignature(body: string, secret = 'test-secret'): string {
  return `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
}

describe('validateWebhookSignature', () => {
  it('returns true for valid signature', () => {
    const body = Buffer.from(JSON.stringify({ test: true }));
    const sig = makeSignature(body.toString());
    expect(validateWebhookSignature(body, sig)).toBe(true);
  });

  it('returns false for invalid signature', () => {
    const body = Buffer.from('{"test":true}');
    expect(validateWebhookSignature(body, 'sha256=invalidsig')).toBe(false);
  });

  it('returns false when signature is missing', () => {
    const body = Buffer.from('{}');
    expect(validateWebhookSignature(body, undefined)).toBe(false);
  });
});

describe('parseWebhookPayload', () => {
  it('parses a text message', () => {
    const events = parseWebhookPayload(textMessage);
    expect(events).toHaveLength(1);
    const event = events[0];
    expect(event?.type).toBe('text');
    if (event?.type === 'text') {
      expect(event.text.body).toBe('Nataka TV nzuri ya 43 inch');
      expect(event.from).toBe('254712345678'); // already normalized
    }
  });

  it('normalizes phone number from 0712... format', () => {
    const events = parseWebhookPayload(interactiveReply);
    expect(events).toHaveLength(1);
    const event = events[0];
    expect(event?.from).toBe('254712345678');
  });

  it('parses an interactive list reply', () => {
    const events = parseWebhookPayload(interactiveReply);
    const event = events[0];
    expect(event?.type).toBe('interactive');
    if (event?.type === 'interactive') {
      expect(event.interactive.type).toBe('list_reply');
    }
  });

  it('parses a status update', () => {
    const events = parseWebhookPayload(statusUpdate);
    expect(events).toHaveLength(1);
    const event = events[0];
    expect(event?.type).toBe('status');
    if (event?.type === 'status') {
      expect(event.status).toBe('delivered');
    }
  });

  it('returns empty array for malformed payload', () => {
    const events = parseWebhookPayload({ bad: 'data' });
    expect(events).toEqual([]);
  });

  it('returns empty array for missing messages', () => {
    const empty = {
      messaging_product: 'whatsapp',
      entry: [{ changes: [{ value: {} }] }],
    };
    const events = parseWebhookPayload(empty);
    expect(events).toEqual([]);
  });
});
