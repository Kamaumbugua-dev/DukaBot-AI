import { describe, it, expect } from 'vitest';
import { calculateTotal, calculateSubtotal } from '../../../src/commerce/pricing';
import type { CartItem } from '../../../src/types/commerce';

const item = (priceKES: number, quantity: number): CartItem => ({
  productId: 'p1',
  name: 'Test Product',
  priceKES,
  quantity,
});

describe('calculateSubtotal', () => {
  it('calculates total for single item', () => {
    expect(calculateSubtotal([item(15000, 1)])).toBe(15000);
  });

  it('calculates total for multiple items', () => {
    expect(calculateSubtotal([item(10000, 2), item(5000, 1)])).toBe(25000);
  });

  it('returns 0 for empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe('calculateTotal', () => {
  it('returns subtotal when no discount', () => {
    expect(calculateTotal([item(30000, 1)])).toBe(30000);
  });

  it('applies 10% percentage discount', () => {
    expect(calculateTotal([item(100000, 1)], { type: 'percentage', value: 10 })).toBe(90000);
  });

  it('applies KES 500 flat discount', () => {
    expect(calculateTotal([item(5000, 1)], { type: 'fixed', value: 500 })).toBe(4500);
  });

  it('discount never makes total negative', () => {
    expect(calculateTotal([item(100, 1)], { type: 'fixed', value: 500 })).toBe(0);
  });
});
