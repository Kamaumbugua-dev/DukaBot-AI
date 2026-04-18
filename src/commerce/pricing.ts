import type { CartItem, Discount } from '../types/commerce';

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.priceKES * item.quantity, 0);
}

export function calculateTotal(items: CartItem[], discount?: Discount): number {
  const subtotal = calculateSubtotal(items);
  if (!discount) return subtotal;

  const discounted =
    discount.type === 'percentage'
      ? subtotal * (1 - discount.value / 100)
      : subtotal - discount.value;

  return Math.max(0, discounted);
}
