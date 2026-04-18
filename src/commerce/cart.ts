import type { CartState, CartItem, Product, Discount } from '../types/commerce';
import { calculateTotal } from './pricing';
import { ValidationError } from '../shared/errors';

type Result<T> = { ok: true; data: T } | { ok: false; error: ValidationError };

const MAX_CART_ITEMS = 20;

export function createEmptyCart(): CartState {
  return { status: 'empty' };
}

export function addItem(
  cart: CartState,
  product: Product,
  quantity: number,
): Result<CartState> {
  if (cart.status === 'expired' || cart.status === 'completed') {
    return { ok: false, error: new ValidationError('Cart is no longer active') };
  }

  if (quantity <= 0) {
    return { ok: false, error: new ValidationError('Quantity must be positive') };
  }

  if (product.stock < quantity) {
    return {
      ok: false,
      error: new ValidationError(`Insufficient stock`),
    };
  }

  const existingItems = cart.status === 'active' ? cart.items : [];

  // Check if product already in cart
  const existingIndex = existingItems.findIndex((i) => i.productId === product.id);
  let newItems: CartItem[];

  if (existingIndex >= 0) {
    const existing = existingItems[existingIndex];
    if (!existing) {
      return { ok: false, error: new ValidationError('Cart item not found') };
    }
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      return { ok: false, error: new ValidationError(`Insufficient stock`) };
    }
    newItems = existingItems.map((item, idx) =>
      idx === existingIndex ? { ...item, quantity: newQty } : item,
    );
  } else {
    if (existingItems.length >= MAX_CART_ITEMS) {
      return { ok: false, error: new ValidationError('Cart is full') };
    }
    const newItem: CartItem = {
      productId: product.id,
      name: product.name,
      priceKES: product.priceKES,
      quantity,
      imageUrl: product.imageUrl,
    };
    newItems = [...existingItems, newItem];
  }

  return {
    ok: true,
    data: { status: 'active', items: newItems, lastUpdated: new Date() },
  };
}

export function removeItem(cart: CartState, productId: string): Result<CartState> {
  if (cart.status !== 'active') {
    return { ok: false, error: new ValidationError('No active cart') };
  }

  const newItems = cart.items.filter((i) => i.productId !== productId);

  if (newItems.length === 0) {
    return { ok: true, data: { status: 'empty' } };
  }

  return {
    ok: true,
    data: { status: 'active', items: newItems, lastUpdated: new Date() },
  };
}

export function getCartTotal(cart: CartState, discount?: Discount): number {
  if (cart.status !== 'active' && cart.status !== 'checkout') return 0;
  return calculateTotal(cart.items, discount);
}

export function startCheckout(cart: CartState, paymentRef: string): Result<CartState> {
  if (cart.status !== 'active') {
    return { ok: false, error: new ValidationError('Cart must be active to checkout') };
  }
  if (cart.items.length === 0) {
    return { ok: false, error: new ValidationError('Cart is empty') };
  }
  return {
    ok: true,
    data: { status: 'checkout', items: cart.items, paymentRef },
  };
}
