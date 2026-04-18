import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().default('3000').transform(Number),

  // Database
  DATABASE_URL: z.string().min(1, 'MISSING: DATABASE_URL'),

  // Redis
  REDIS_URL: z.string().min(1, 'MISSING: REDIS_URL'),

  // WhatsApp Cloud API
  WHATSAPP_TOKEN: z.string().min(1, 'MISSING: WHATSAPP_TOKEN'),
  WHATSAPP_PHONE_ID: z.string().min(1, 'MISSING: WHATSAPP_PHONE_ID'),
  WHATSAPP_VERIFY_TOKEN: z.string().min(1, 'MISSING: WHATSAPP_VERIFY_TOKEN'),
  WHATSAPP_APP_SECRET: z.string().min(1, 'MISSING: WHATSAPP_APP_SECRET'),

  // Anthropic
  ANTHROPIC_API_KEY: z.string().min(1, 'MISSING: ANTHROPIC_API_KEY'),
  CLAUDE_MODEL: z.string().default('claude-sonnet-4-20250514'),
  CLAUDE_MODEL_COMPLEX: z.string().default('claude-opus-4-6'),

  // M-Pesa Daraja
  MPESA_CONSUMER_KEY: z.string().min(1, 'MISSING: MPESA_CONSUMER_KEY'),
  MPESA_CONSUMER_SECRET: z.string().min(1, 'MISSING: MPESA_CONSUMER_SECRET'),
  MPESA_SHORTCODE: z.string().min(1, 'MISSING: MPESA_SHORTCODE'),
  MPESA_PASSKEY: z.string().min(1, 'MISSING: MPESA_PASSKEY'),
  MPESA_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
  MPESA_CALLBACK_URL: z.string().url('MISSING: MPESA_CALLBACK_URL must be a valid URL'),

  // Cloudflare (optional)
  CF_ZONE_ID: z.string().optional(),
  CF_API_TOKEN: z.string().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues.map((i) => `  - ${i.message}`).join('\n');
    console.error(`\n❌ Environment validation failed:\n${missing}\n`);
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
export type Env = z.infer<typeof envSchema>;
