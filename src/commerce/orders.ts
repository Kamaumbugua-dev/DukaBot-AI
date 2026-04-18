import { db } from '../config/database';
import { logger } from '../shared/logger';
import { AppError, NotFoundError } from '../shared/errors';
import { OrderStatus } from '../types/commerce';
import type { Order, CartItem } from '../types/commerce';

type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

// Valid transitions
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PAYMENT_INITIATED, OrderStatus.CANCELLED],
  [OrderStatus.PAYMENT_INITIATED]: [OrderStatus.PAID, OrderStatus.PAYMENT_FAILED],
  [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.RETURNED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
  [OrderStatus.PAYMENT_FAILED]: [OrderStatus.PAYMENT_INITIATED, OrderStatus.CANCELLED],
  [OrderStatus.RETURNED]: [],
};

type DbOrder = {
  id: string;
  customer_id: string;
  merchant_id: string;
  items: CartItem[];
  total_kes: string;
  status: OrderStatus;
  mpesa_ref?: string;
  mpesa_receipt?: string;
  created_at: Date;
};

function mapOrder(row: DbOrder): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    merchantId: row.merchant_id,
    items: row.items,
    totalKES: parseFloat(row.total_kes),
    status: row.status,
    mpesaRef: row.mpesa_ref,
    mpesaReceipt: row.mpesa_receipt,
    createdAt: row.created_at,
  };
}

export async function createOrder(params: {
  customerId: string;
  merchantId: string;
  items: CartItem[];
  totalKES: number;
}): Promise<Result<Order>> {
  try {
    const { rows } = await db.query<DbOrder>(
      `INSERT INTO orders (customer_id, merchant_id, items, total_kes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [params.customerId, params.merchantId, JSON.stringify(params.items), params.totalKES],
    );
    const row = rows[0];
    if (!row) return { ok: false, error: new AppError('Create order failed', 'ORDER_CREATE_ERROR') };
    return { ok: true, data: mapOrder(row) };
  } catch (err) {
    logger.error({ err }, 'Create order failed');
    return { ok: false, error: new AppError('Failed to create order', 'ORDER_CREATE_ERROR') };
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  mpesaRef?: string,
  mpesaReceipt?: string,
): Promise<Result<Order>> {
  try {
    const { rows: existing } = await db.query<DbOrder>(
      'SELECT * FROM orders WHERE id = $1',
      [orderId],
    );
    const order = existing[0];
    if (!order) return { ok: false, error: new NotFoundError('Order not found') };

    const allowed = VALID_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(newStatus)) {
      return {
        ok: false,
        error: new AppError(
          `Invalid transition: ${order.status} → ${newStatus}`,
          'INVALID_STATUS_TRANSITION',
          400,
        ),
      };
    }

    const { rows } = await db.query<DbOrder>(
      `UPDATE orders
       SET status = $2, mpesa_ref = COALESCE($3, mpesa_ref), mpesa_receipt = COALESCE($4, mpesa_receipt),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [orderId, newStatus, mpesaRef ?? null, mpesaReceipt ?? null],
    );
    const updated = rows[0];
    if (!updated) return { ok: false, error: new AppError('Update failed', 'ORDER_UPDATE_ERROR') };
    return { ok: true, data: mapOrder(updated) };
  } catch (err) {
    logger.error({ err }, 'Update order status failed');
    return { ok: false, error: new AppError('Failed to update order', 'ORDER_UPDATE_ERROR') };
  }
}

export async function getOrderById(orderId: string): Promise<Result<Order>> {
  try {
    const { rows } = await db.query<DbOrder>('SELECT * FROM orders WHERE id = $1', [orderId]);
    const row = rows[0];
    if (!row) return { ok: false, error: new NotFoundError('Order not found') };
    return { ok: true, data: mapOrder(row) };
  } catch (err) {
    logger.error({ err }, 'Get order failed');
    return { ok: false, error: new AppError('Failed to fetch order', 'ORDER_FETCH_ERROR') };
  }
}
