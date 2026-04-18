import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '../../../src/ai/prompts';
import type { Merchant } from '../../../src/types/commerce';

const merchant: Merchant = {
  id: 'm1',
  businessName: 'TechHub Electronics',
  phone: '254700000001',
  waPhoneId: 'WA_PHONE_ID',
  mpesaShortcode: '174379',
  location: 'Luthuli Avenue, Nairobi',
  settings: {
    businessHours: 'Mon-Sat 8AM-6PM',
    categories: ['TVs', 'Phones', 'Accessories'],
  },
  plan: 'pro',
  createdAt: new Date(),
};

describe('buildSystemPrompt', () => {
  it('includes merchant name', () => {
    expect(buildSystemPrompt(merchant)).toContain('TechHub Electronics');
  });

  it('includes business hours', () => {
    expect(buildSystemPrompt(merchant)).toContain('Mon-Sat 8AM-6PM');
  });

  it('includes product categories', () => {
    const prompt = buildSystemPrompt(merchant);
    expect(prompt).toContain('TVs');
    expect(prompt).toContain('Phones');
  });

  it('includes Kenglish examples', () => {
    const prompt = buildSystemPrompt(merchant);
    expect(prompt).toContain('Kenglish');
    expect(prompt).toContain('Sawa');
  });

  it('stays under 3000 tokens (rough char estimate)', () => {
    const prompt = buildSystemPrompt(merchant);
    // Average ~4 chars/token; 3000 tokens ≈ 12000 chars
    expect(prompt.length).toBeLessThan(12000);
  });
});
