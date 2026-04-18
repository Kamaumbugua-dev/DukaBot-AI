import { describe, it, expect } from 'vitest';
import {
  welcomeMessage,
  orderConfirmationMessage,
  paymentPromptMessage,
  productCard,
} from '../../../src/whatsapp/templates';
import { OrderStatus, ProductCategory } from '../../../src/types/commerce';
import type { Order, Product } from '../../../src/types/commerce';

describe('welcomeMessage', () => {
  it('includes merchant name', () => {
    const msg = welcomeMessage('TechHub Electronics');
    expect(msg).toContain('TechHub Electronics');
    expect(msg).toContain('DukaBot');
  });
});

describe('orderConfirmationMessage', () => {
  const order: Order = {
    id: 'ord-aabbccddee',
    customerId: 'cust-1',
    merchantId: 'merch-1',
    items: [{ productId: 'p1', name: 'Hisense TV', priceKES: 38500, quantity: 1 }],
    totalKES: 38500,
    status: OrderStatus.PAID,
    mpesaReceipt: 'QKJ4H7RTXL',
    createdAt: new Date(),
  };

  it('includes short order ID', () => {
    const msg = orderConfirmationMessage(order);
    expect(msg).toContain('CCDDEE'); // last 6 of 'ord-aabbccddee' uppercased
  });

  it('includes formatted total', () => {
    const msg = orderConfirmationMessage(order);
    expect(msg).toContain('38,500');
  });

  it('includes M-Pesa receipt', () => {
    const msg = orderConfirmationMessage(order);
    expect(msg).toContain('QKJ4H7RTXL');
  });

  it('handles missing receipt gracefully', () => {
    const orderNoPay: Order = { ...order, mpesaReceipt: undefined, mpesaRef: undefined };
    const msg = orderConfirmationMessage(orderNoPay);
    expect(msg).toContain('Pending');
  });
});

describe('paymentPromptMessage', () => {
  it('includes formatted amount', () => {
    const msg = paymentPromptMessage(38500);
    expect(msg).toContain('38,500');
    expect(msg).toContain('M-Pesa');
  });
});

describe('productCard', () => {
  const product: Product = {
    id: 'p1',
    merchantId: 'm1',
    name: 'Hisense 43A6H',
    priceKES: 38500,
    category: ProductCategory.TVS,
    description: '4K Smart TV',
    stock: 5,
    active: true,
    createdAt: new Date(),
  };

  it('includes product name and price', () => {
    const card = productCard(product);
    expect(card).toContain('Hisense 43A6H');
    expect(card).toContain('38,500');
  });

  it('shows in-stock status', () => {
    expect(productCard(product)).toContain('In stock');
  });

  it('shows out-of-stock for zero stock', () => {
    expect(productCard({ ...product, stock: 0 })).toContain('Out of stock');
  });
});
