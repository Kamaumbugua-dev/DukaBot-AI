import type { Order, Product } from '../types/commerce';
import { formatKES } from '../shared/utils';

export function welcomeMessage(merchantName: string): string {
  return [
    `Karibu! 👋 Welcome to *${merchantName}*.`,
    `I'm DukaBot, your AI shopping assistant.`,
    `What are you looking for today?`,
  ].join('\n');
}

export function orderConfirmationMessage(order: Order): string {
  const shortId = order.id.slice(-6).toUpperCase();
  return [
    `✅ *Order Confirmed!*`,
    ``,
    `Order: #${shortId}`,
    `Items: ${order.items.length}`,
    `Total: *${formatKES(order.totalKES)}*`,
    ``,
    `Payment via M-Pesa: ${order.mpesaReceipt ?? order.mpesaRef ?? 'Pending'}`,
    ``,
    `Delivery: 2-3 business days`,
    `Asante sana! 🙏`,
  ].join('\n');
}

export function paymentPromptMessage(amount: number): string {
  return [
    `M-Pesa prompt imekuja kwa simu yako! 📱`,
    `Enter your M-Pesa PIN to complete payment ya *${formatKES(amount)}*.`,
    ``,
    `Nisubiri confirmation... ⏳`,
  ].join('\n');
}

export function paymentFailedMessage(): string {
  return [
    `❌ Payment haikufanikiwa.`,
    ``,
    `Cart yako bado iko active. Reply *"lipa"* to try again.`,
    `Au wasiliana na support kama tatizo linaendelea.`,
  ].join('\n');
}

export function productCard(product: Product): string {
  return [
    `*${product.name}*`,
    `Price: *${formatKES(product.priceKES)}*`,
    product.description ? `${product.description}` : null,
    product.stock > 0 ? `✅ In stock` : `❌ Out of stock`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function offHoursMessage(businessHours: string): string {
  return [
    `Asante kwa message! 😊`,
    `Sisi hufanya kazi ${businessHours}.`,
    `Nitakujibu first thing kesho!`,
  ].join('\n');
}
