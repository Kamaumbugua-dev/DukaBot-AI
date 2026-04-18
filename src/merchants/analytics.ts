import { db } from '../config/database';
import { logger } from '../shared/logger';
import { AppError } from '../shared/errors';

type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

export type MerchantAnalytics = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  ordersByStatus: Record<string, number>;
  dailyRevenue: Array<{ date: string; revenue: number; orders: number }>;
};

export async function getMerchantAnalytics(
  merchantId: string,
  days = 30,
): Promise<Result<MerchantAnalytics>> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // Total orders & revenue
    const { rows: summary } = await db.query<{
      total_orders: string;
      total_revenue: string;
      avg_order_value: string;
    }>(
      `SELECT
         COUNT(*)::text            AS total_orders,
         COALESCE(SUM(total_kes), 0)::text AS total_revenue,
         COALESCE(AVG(total_kes), 0)::text AS avg_order_value
       FROM orders
       WHERE merchant_id = $1
         AND status IN ('paid', 'shipped', 'delivered')
         AND created_at >= $2`,
      [merchantId, since],
    );

    // Orders by status
    const { rows: statusRows } = await db.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*)::text AS count
       FROM orders
       WHERE merchant_id = $1 AND created_at >= $2
       GROUP BY status`,
      [merchantId, since],
    );

    // Top products from order items (JSONB)
    const { rows: productRows } = await db.query<{
      name: string;
      quantity: string;
      revenue: string;
    }>(
      `SELECT
         item->>'name'                         AS name,
         SUM((item->>'quantity')::int)::text   AS quantity,
         SUM((item->>'priceKES')::numeric * (item->>'quantity')::int)::text AS revenue
       FROM orders,
            jsonb_array_elements(items) AS item
       WHERE merchant_id = $1
         AND status IN ('paid', 'shipped', 'delivered')
         AND created_at >= $2
       GROUP BY item->>'name'
       ORDER BY revenue DESC
       LIMIT 5`,
      [merchantId, since],
    );

    // Daily revenue
    const { rows: dailyRows } = await db.query<{
      date: string;
      revenue: string;
      orders: string;
    }>(
      `SELECT
         DATE(created_at)::text                AS date,
         COALESCE(SUM(total_kes), 0)::text     AS revenue,
         COUNT(*)::text                        AS orders
       FROM orders
       WHERE merchant_id = $1
         AND status IN ('paid', 'shipped', 'delivered')
         AND created_at >= $2
       GROUP BY DATE(created_at)
       ORDER BY date DESC
       LIMIT $3`,
      [merchantId, since, days],
    );

    const sumRow = summary[0];

    return {
      ok: true,
      data: {
        totalOrders: parseInt(sumRow?.total_orders ?? '0'),
        totalRevenue: parseFloat(sumRow?.total_revenue ?? '0'),
        averageOrderValue: parseFloat(sumRow?.avg_order_value ?? '0'),
        topProducts: productRows.map((r) => ({
          name: r.name,
          quantity: parseInt(r.quantity),
          revenue: parseFloat(r.revenue),
        })),
        ordersByStatus: Object.fromEntries(statusRows.map((r) => [r.status, parseInt(r.count)])),
        dailyRevenue: dailyRows.map((r) => ({
          date: r.date,
          revenue: parseFloat(r.revenue),
          orders: parseInt(r.orders),
        })),
      },
    };
  } catch (err) {
    logger.error({ err }, 'getMerchantAnalytics failed');
    return { ok: false, error: new AppError('Analytics query failed', 'ANALYTICS_ERROR') };
  }
}
