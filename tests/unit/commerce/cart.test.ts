import { describe, it, expect } from 'vitest';
import {
  createEmptyCart,
  addItem,
  removeItem,
  getCartTotal,
  startCheckout,
} from '../../../src/commerce/cart';
import { ProductCategory } from '../../../src/types/commerce';
import type { Product } from '../../../src/types/commerce';

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'p1',
    merchantId: 'm1',
    name: 'Hisense TV',
    priceKES: 38500,
    category: ProductCategory.TVS,
    stock: 10,
    active: true,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('createEmptyCart', () => {
  it('creates empty cart', () => {
    const cart = createEmptyCart();
    expect(cart.status).toBe('empty');
  });
});

describe('addItem', () => {
  it('adds a product to an empty cart', () => {
    const cart = createEmptyCart();
    const result = addItem(cart, makeProduct(), 1);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('active');
      if (result.data.status === 'active') {
        expect(result.data.items).toHaveLength(1);
        expect(result.data.items[0]?.priceKES).toBe(38500);
      }
    }
  });

  it('increments quantity for duplicate product', () => {
    const cart = createEmptyCart();
    const product = makeProduct();
    const r1 = addItem(cart, product, 1);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    const r2 = addItem(r1.data, product, 2);
    expect(r2.ok).toBe(true);
    if (r2.ok && r2.data.status === 'active') {
      expect(r2.data.items).toHaveLength(1);
      expect(r2.data.items[0]?.quantity).toBe(3);
    }
  });

  it('rejects quantity exceeding stock', () => {
    const cart = createEmptyCart();
    const result = addItem(cart, makeProduct({ stock: 2 }), 5);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects adding to expired cart', () => {
    const result = addItem({ status: 'expired' }, makeProduct(), 1);
    expect(result.ok).toBe(false);
  });

  it('rejects adding to completed cart', () => {
    const result = addItem({ status: 'completed', orderId: 'ord-1' }, makeProduct(), 1);
    expect(result.ok).toBe(false);
  });
});

describe('removeItem', () => {
  it('removes item from cart', () => {
    const product = makeProduct();
    const cart = addItem(createEmptyCart(), product, 1);
    expect(cart.ok).toBe(true);
    if (!cart.ok) return;

    const result = removeItem(cart.data, 'p1');
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.status).toBe('empty');
  });

  it('returns error for non-active cart', () => {
    const result = removeItem(createEmptyCart(), 'p1');
    expect(result.ok).toBe(false);
  });
});

describe('getCartTotal', () => {
  it('returns 0 for empty cart', () => {
    expect(getCartTotal(createEmptyCart())).toBe(0);
  });

  it('calculates total correctly', () => {
    const cart = addItem(createEmptyCart(), makeProduct({ priceKES: 38500 }), 2);
    expect(cart.ok).toBe(true);
    if (cart.ok) expect(getCartTotal(cart.data)).toBe(77000);
  });
});

describe('startCheckout', () => {
  it('transitions active cart to checkout', () => {
    const cart = addItem(createEmptyCart(), makeProduct(), 1);
    expect(cart.ok).toBe(true);
    if (!cart.ok) return;

    const result = startCheckout(cart.data, 'REF123');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.status).toBe('checkout');
      if (result.data.status === 'checkout') {
        expect(result.data.paymentRef).toBe('REF123');
      }
    }
  });

  it('rejects checkout of empty cart', () => {
    const result = startCheckout(createEmptyCart(), 'REF');
    expect(result.ok).toBe(false);
  });
});
