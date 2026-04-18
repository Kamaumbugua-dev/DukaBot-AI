import 'dotenv/config';
import { randomUUID } from 'crypto';
import express, { type Request, type Response, type NextFunction } from 'express';
import { env } from './config/env';
import { checkDatabaseConnection } from './config/database';
import { connectRedis, checkRedisConnection } from './config/redis';
import { logger } from './shared/logger';
import { AppError } from './shared/errors';
import { handleVerification, validateWebhookSignature, parseWebhookPayload } from './whatsapp/webhook';
import { sendTextMessage } from './whatsapp/sender';
import { parseCallback } from './commerce/mpesa';
import { updateOrderStatus } from './commerce/orders';
import { OrderStatus } from './types/commerce';
import { merchantRouter } from './merchants/routes';

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────

app.use(express.json());

// Attach request ID to every request
app.use((req: Request, _res: Response, next: NextFunction) => {
  (req as Request & { id: string }).id = randomUUID();
  next();
});

// ─── Health ──────────────────────────────────────────────────────────────────

app.get('/health', async (_req: Request, res: Response) => {
  const [dbOk, redisOk] = await Promise.all([
    checkDatabaseConnection(),
    checkRedisConnection(),
  ]);

  const status = dbOk && redisOk ? 'ok' : 'degraded';
  res.status(status === 'ok' ? 200 : 503).json({
    status,
    version: process.env['npm_package_version'] ?? '1.0.0',
    uptime: Math.floor(process.uptime()),
    database: dbOk ? 'connected' : 'error',
    redis: redisOk ? 'connected' : 'error',
  });
});

// ─── WhatsApp Webhook ────────────────────────────────────────────────────────

app.get('/webhook/whatsapp', handleVerification);

app.post(
  '/webhook/whatsapp',
  express.raw({ type: 'application/json' }),
  (req: Request, res: Response) => {
    const signature = req.headers['x-hub-signature-256'] as string | undefined;

    if (!validateWebhookSignature(req.body as Buffer, signature)) {
      logger.warn('Invalid webhook signature — rejecting');
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    // Acknowledge immediately — WhatsApp requires response within 15s
    res.status(200).json({ status: 'ok' });

    // Process asynchronously
    const payload = JSON.parse((req.body as Buffer).toString());
    const events = parseWebhookPayload(payload);

    for (const event of events) {
      if (event.type === 'text') {
        // Phase 3 note: replace echo with AI agent call here
        sendTextMessage({
          to: event.from,
          body: `Echo: ${event.text.body}`,
        }).catch((err) => logger.error({ err }, 'Failed to send reply'));
      }
    }
  },
);

// ─── M-Pesa Callback ─────────────────────────────────────────────────────────

app.post('/mpesa/callback', async (req: Request, res: Response) => {
  // Always ACK immediately
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Accepted' });

  const result = parseCallback(req.body);
  if (!result.ok) {
    logger.warn('Invalid M-Pesa callback');
    return;
  }

  const { data } = result;
  logger.info({ checkoutRequestId: data.checkoutRequestId, success: data.success }, 'M-Pesa callback received');

  if (data.success && data.mpesaReceipt) {
    // Find the order by mpesa_ref = checkoutRequestId and update to PAID
    try {
      const { rows } = await (await import('./config/database')).db.query<{ id: string }>(
        `SELECT id FROM orders WHERE mpesa_ref = $1 AND status = 'payment_initiated'`,
        [data.checkoutRequestId],
      );
      const order = rows[0];
      if (order) {
        await updateOrderStatus(order.id, OrderStatus.PAID, undefined, data.mpesaReceipt);
        logger.info({ orderId: order.id }, 'Order marked as PAID');
      }
    } catch (err) {
      logger.error({ err }, 'Failed to update order after M-Pesa callback');
    }
  }
});

// ─── Merchant API ─────────────────────────────────────────────────────────────

app.use('/api', merchantRouter);

// ─── Global Error Handler ────────────────────────────────────────────────────

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError && err.isOperational) {
    logger.warn({ code: err.code, statusCode: err.statusCode }, err.message);
    res.status(err.statusCode).json({ error: err.message, code: err.code });
    return;
  }
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({ error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' });
});

// ─── Start ───────────────────────────────────────────────────────────────────

async function start() {
  try {
    await connectRedis();
  } catch (err) {
    logger.warn({ err }, 'Redis unavailable at startup — will retry on requests');
  }

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started');
  });
}

start();

export { app };
