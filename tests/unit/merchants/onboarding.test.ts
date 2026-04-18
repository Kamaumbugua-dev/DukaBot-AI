import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/config/env', () => ({
  env: { NODE_ENV: 'test', PORT: 3000, DATABASE_URL: 'postgresql://test', REDIS_URL: 'redis://test' },
}));
vi.mock('../../../src/config/database', () => ({ db: { query: vi.fn() } }));
vi.mock('../../../src/config/redis', () => ({ redis: { get: vi.fn(), setEx: vi.fn() } }));

import { getNextOnboardingMessage } from '../../../src/merchants/onboarding';
import type { OnboardingState } from '../../../src/merchants/onboarding';

describe('getNextOnboardingMessage', () => {
  it('returns welcome message on ask_business_name with no input', () => {
    const state: OnboardingState = { step: 'ask_business_name', phone: '254712345678' };
    const { reply, nextState } = getNextOnboardingMessage(state);
    expect(reply).toContain('Karibu');
    expect(nextState.step).toBe('ask_business_name');
  });

  it('advances to ask_location after business name is given', () => {
    const state: OnboardingState = { step: 'ask_business_name', phone: '254712345678' };
    const { reply, nextState } = getNextOnboardingMessage(state, 'TechHub Electronics');
    expect(nextState.step).toBe('ask_location');
    expect(nextState.businessName).toBe('TechHub Electronics');
    expect(reply).toContain('TechHub Electronics');
  });

  it('advances to ask_mpesa_code after location is given', () => {
    const state: OnboardingState = {
      step: 'ask_location',
      phone: '254712345678',
      businessName: 'TechHub Electronics',
    };
    const { reply, nextState } = getNextOnboardingMessage(state, 'Luthuli Avenue');
    expect(nextState.step).toBe('ask_mpesa_code');
    expect(nextState.location).toBe('Luthuli Avenue');
    expect(reply).toContain('M-Pesa');
  });

  it('shows confirmation summary after M-Pesa code', () => {
    const state: OnboardingState = {
      step: 'ask_mpesa_code',
      phone: '254712345678',
      businessName: 'TechHub',
      location: 'Nairobi',
    };
    const { reply, nextState } = getNextOnboardingMessage(state, '174379');
    expect(nextState.step).toBe('confirm');
    expect(reply).toContain('TechHub');
    expect(reply).toContain('174379');
    expect(reply).toContain('Ndiyo');
  });

  it('completes registration on "Ndiyo" confirmation', () => {
    const state: OnboardingState = {
      step: 'confirm',
      phone: '254712345678',
      businessName: 'TechHub',
      location: 'Nairobi',
      mpesaShortcode: '174379',
    };
    const { reply, nextState } = getNextOnboardingMessage(state, 'Ndiyo');
    expect(nextState.step).toBe('complete');
    expect(reply).toContain('Hongera');
  });

  it('restarts on "Hapana" at confirmation', () => {
    const state: OnboardingState = {
      step: 'confirm',
      phone: '254712345678',
      businessName: 'TechHub',
    };
    const { nextState } = getNextOnboardingMessage(state, 'Hapana');
    expect(nextState.step).toBe('ask_business_name');
    expect(nextState.businessName).toBeUndefined();
  });
});
