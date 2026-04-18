import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';
import type { Request, Response } from 'express';
import { env } from '../config/env';
import { logger } from '../shared/logger';
import { normalizePhone } from '../shared/utils';
import type {
  WhatsAppMessage,
  WhatsAppStatusUpdate,
  IncomingWebhookEvent,
} from '../types/whatsapp';

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const waTextSchema = z.object({
  messaging_product: z.literal('whatsapp'),
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            messages: z
              .array(
                z.object({
                  id: z.string(),
                  from: z.string(),
                  timestamp: z.string(),
                  type: z.enum(['text', 'image', 'interactive', 'order', 'unknown']),
                  text: z.object({ body: z.string().max(4096) }).optional(),
                  image: z
                    .object({
                      id: z.string(),
                      mime_type: z.string(),
                      caption: z.string().optional(),
                    })
                    .optional(),
                  interactive: z
                    .union([
                      z.object({
                        type: z.literal('button_reply'),
                        button_reply: z.object({ id: z.string(), title: z.string() }),
                      }),
                      z.object({
                        type: z.literal('list_reply'),
                        list_reply: z.object({
                          id: z.string(),
                          title: z.string(),
                          description: z.string().optional(),
                        }),
                      }),
                    ])
                    .optional(),
                  order: z
                    .object({
                      catalog_id: z.string(),
                      product_items: z.array(
                        z.object({
                          product_retailer_id: z.string(),
                          quantity: z.number(),
                          item_price: z.number(),
                        }),
                      ),
                    })
                    .optional(),
                }),
              )
              .optional(),
            statuses: z
              .array(
                z.object({
                  id: z.string(),
                  recipient_id: z.string(),
                  status: z.enum(['sent', 'delivered', 'read', 'failed']),
                  timestamp: z.string(),
                }),
              )
              .optional(),
          }),
        }),
      ),
    }),
  ),
});

// ─── Signature validation ─────────────────────────────────────────────────────

export function validateWebhookSignature(
  payload: Buffer,
  signature: string | undefined,
): boolean {
  if (!signature) return false;

  const expected = createHmac('sha256', env.WHATSAPP_APP_SECRET)
    .update(payload)
    .digest('hex');

  const expectedSig = `sha256=${expected}`;

  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}

// ─── Webhook verification (GET) ───────────────────────────────────────────────

export function handleVerification(req: Request, res: Response): void {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
    logger.info('WhatsApp webhook verified');
    res.status(200).send(challenge);
    return;
  }

  logger.warn({ mode, token }, 'Webhook verification failed');
  res.status(403).json({ error: 'Verification failed' });
}

// ─── Message parsing ──────────────────────────────────────────────────────────

export function parseWebhookPayload(rawBody: unknown): IncomingWebhookEvent[] {
  const parsed = waTextSchema.safeParse(rawBody);
  if (!parsed.success) {
    logger.warn({ issues: parsed.error.issues }, 'Invalid webhook payload');
    return [];
  }

  const events: IncomingWebhookEvent[] = [];

  for (const entry of parsed.data.entry) {
    for (const change of entry.changes) {
      const { messages = [], statuses = [] } = change.value;

      for (const msg of messages) {
        const normalizedPhone = normalizePhone(msg.from);
        const timestamp = new Date(parseInt(msg.timestamp, 10) * 1000);

        if (msg.type === 'text' && msg.text) {
          events.push({
            type: 'text',
            from: normalizedPhone,
            id: msg.id,
            timestamp,
            text: { body: msg.text.body },
          } satisfies WhatsAppMessage);
        } else if (msg.type === 'image' && msg.image) {
          events.push({
            type: 'image',
            from: normalizedPhone,
            id: msg.id,
            timestamp,
            image: msg.image,
          } satisfies WhatsAppMessage);
        } else if (msg.type === 'interactive' && msg.interactive) {
          events.push({
            type: 'interactive',
            from: normalizedPhone,
            id: msg.id,
            timestamp,
            interactive: msg.interactive,
          } satisfies WhatsAppMessage);
        } else if (msg.type === 'order' && msg.order) {
          events.push({
            type: 'order',
            from: normalizedPhone,
            id: msg.id,
            timestamp,
            order: msg.order,
          } satisfies WhatsAppMessage);
        }
      }

      for (const status of statuses) {
        events.push({
          type: 'status',
          id: status.id,
          status: status.status,
          timestamp: new Date(parseInt(status.timestamp, 10) * 1000),
          recipientId: normalizePhone(status.recipient_id),
        } satisfies WhatsAppStatusUpdate);
      }
    }
  }

  return events;
}
