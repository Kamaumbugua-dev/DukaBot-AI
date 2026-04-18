import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { getMerchantById, registerMerchant } from './onboarding';
import { getMerchantSettings, updateMerchantSettings } from './settings';
import { getMerchantAnalytics } from './analytics';
import { getOrderById, updateOrderStatus } from '../commerce/orders';
import { createProduct } from '../commerce/catalog';
import { logger } from '../shared/logger';
import { OrderStatus, ProductCategory } from '../types/commerce';

export const merchantRouter = Router();

// ─── Register merchant ────────────────────────────────────────────────────────
merchantRouter.post('/merchants', async (req: Request, res: Response) => {
  const schema = z.object({
    businessName: z.string().min(2),
    phone: z.string(),
    waPhoneId: z.string(),
    mpesaShortcode: z.string().optional(),
    location: z.string().optional(),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
    return;
  }

  const result = await registerMerchant(parsed.data);
  if (!result.ok) {
    res.status(500).json({ error: result.error.message });
    return;
  }
  res.status(201).json(result.data);
});

// ─── Get merchant ─────────────────────────────────────────────────────────────
merchantRouter.get('/merchants/:id', async (req: Request, res: Response) => {
  const result = await getMerchantById(String(req.params['id'] ?? ''));
  if (!result.ok) {
    res.status(404).json({ error: result.error.message });
    return;
  }
  res.json(result.data);
});

// ─── Analytics ───────────────────────────────────────────────────────────────
merchantRouter.get('/merchants/:id/analytics', async (req: Request, res: Response) => {
  const days = parseInt(String(req.query['days'] ?? '30'));
  const result = await getMerchantAnalytics(String(req.params['id'] ?? ''), days);
  if (!result.ok) {
    res.status(500).json({ error: result.error.message });
    return;
  }
  res.json(result.data);
});

// ─── Settings ────────────────────────────────────────────────────────────────
merchantRouter.get('/merchants/:id/settings', async (req: Request, res: Response) => {
  const result = await getMerchantSettings(String(req.params['id'] ?? ''));
  if (!result.ok) {
    res.status(404).json({ error: result.error.message });
    return;
  }
  res.json(result.data);
});

merchantRouter.patch('/merchants/:id/settings', async (req: Request, res: Response) => {
  const result = await updateMerchantSettings(String(req.params['id'] ?? ''), req.body as Record<string, unknown>);
  if (!result.ok) {
    res.status(500).json({ error: result.error.message });
    return;
  }
  res.json(result.data);
});

// ─── Product management ───────────────────────────────────────────────────────
merchantRouter.post('/merchants/:id/products', async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string().min(2).max(200),
    priceKES: z.number().positive(),
    category: z.nativeEnum(ProductCategory),
    description: z.string().max(1000).optional(),
    imageUrl: z.string().url().optional(),
    stock: z.number().int().nonnegative().default(0),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
    return;
  }

  const result = await createProduct(String(req.params['id'] ?? ''), parsed.data);

  if (!result.ok) {
    res.status(500).json({ error: result.error.message });
    return;
  }
  res.status(201).json(result.data);
});

// ─── Order management ────────────────────────────────────────────────────────
merchantRouter.get('/merchants/:id/orders/:orderId', async (req: Request, res: Response) => {
  const result = await getOrderById(String(req.params['orderId'] ?? ''));
  if (!result.ok) {
    res.status(404).json({ error: result.error.message });
    return;
  }
  // Verify order belongs to this merchant
  if (result.data.merchantId !== req.params['id']) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  res.json(result.data);
});

merchantRouter.patch('/merchants/:id/orders/:orderId/status', async (req: Request, res: Response) => {
  const schema = z.object({
    status: z.nativeEnum(OrderStatus),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }

  // Verify order belongs to merchant
  const orderResult = await getOrderById(String(req.params['orderId'] ?? ''));
  if (!orderResult.ok) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  if (orderResult.data.merchantId !== req.params['id']) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const result = await updateOrderStatus(String(req.params['orderId'] ?? ''), parsed.data.status);
  if (!result.ok) {
    res.status(400).json({ error: result.error.message });
    return;
  }

  logger.info({ orderId: result.data.id, status: result.data.status }, 'Order status updated by merchant');
  res.json(result.data);
});
