import { z } from 'zod';

export const kenyanPhoneSchema = z
  .string()
  .regex(/^(\+?254|0)\d{9}$/, 'Invalid Kenyan phone number');

export const kesAmountSchema = z
  .number()
  .positive()
  .max(10_000_000, 'Amount exceeds maximum');

export const productNameSchema = z.string().min(2).max(200);

export const merchantSettingsSchema = z.object({
  businessHours: z.string().optional(),
  categories: z.array(z.string()).optional(),
  deliveryInfo: z.string().optional(),
  offHoursMessage: z.string().optional(),
  deliveryZones: z.array(z.string()).optional(),
  deliveryFee: z.number().nonnegative().optional(),
});

export type MerchantSettings = z.infer<typeof merchantSettingsSchema>;
