import { env } from '../config/env';
import { redis } from '../config/redis';
import { logger } from '../shared/logger';
import { MpesaError } from '../shared/errors';
import { normalizePhone, generateRef, sleep, backoffDelay } from '../shared/utils';
import { z } from 'zod';

type Result<T> = { ok: true; data: T } | { ok: false; error: MpesaError };

const MPESA_BASE = {
  sandbox: 'https://sandbox.safaricom.co.ke',
  production: 'https://api.safaricom.co.ke',
};

const OAUTH_CACHE_KEY = 'mpesa:oauth_token';
const OAUTH_TTL_SECONDS = 55 * 60; // 55 minutes

// ─── Zod schemas ─────────────────────────────────────────────────────────────

export const mpesaCallbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z
        .object({
          Item: z.array(
            z.object({
              Name: z.string(),
              Value: z.union([z.string(), z.number()]).optional(),
            }),
          ),
        })
        .optional(),
    }),
  }),
});

export type MpesaCallback = z.infer<typeof mpesaCallbackSchema>;

export type STKPushResult = {
  checkoutRequestId: string;
  merchantRequestId: string;
  transactionRef: string;
};

export type CallbackResult = {
  success: boolean;
  checkoutRequestId: string;
  mpesaReceipt?: string;
  amount?: number;
  phoneNumber?: string;
  transactionDate?: string;
};

// ─── Phone normalization ──────────────────────────────────────────────────────

export { normalizePhone as normalizeMpesaPhone };

// ─── OAuth token ──────────────────────────────────────────────────────────────

async function getOAuthToken(): Promise<Result<string>> {
  // Check Redis cache first
  try {
    const cached = await redis.get(OAUTH_CACHE_KEY);
    if (cached) return { ok: true, data: cached };
  } catch {
    // Redis miss — proceed to fetch
  }

  const base = MPESA_BASE[env.MPESA_ENV];
  const credentials = Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString('base64');

  try {
    const res = await fetch(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!res.ok) {
      return { ok: false, error: new MpesaError(`OAuth failed: ${res.status}`, 'MPESA_OAUTH_ERROR') };
    }

    const data = (await res.json()) as { access_token: string };
    const token = data.access_token;

    // Cache in Redis
    await redis.setEx(OAUTH_CACHE_KEY, OAUTH_TTL_SECONDS, token);
    return { ok: true, data: token };
  } catch (err) {
    logger.error({ err }, 'M-Pesa OAuth token fetch failed');
    return { ok: false, error: new MpesaError('Failed to get OAuth token', 'MPESA_OAUTH_ERROR') };
  }
}

// ─── STK Push ─────────────────────────────────────────────────────────────────

function buildPassword(shortcode: string, passkey: string): { password: string; timestamp: string } {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);
  const raw = `${shortcode}${passkey}${timestamp}`;
  const password = Buffer.from(raw).toString('base64');
  return { password, timestamp };
}

export async function initiateSTKPush(params: {
  phone: string;
  amountKES: number;
  accountRef: string;
  description: string;
}, attempt = 0): Promise<Result<STKPushResult>> {
  const tokenResult = await getOAuthToken();
  if (!tokenResult.ok) return tokenResult;

  const normalizedPhone = normalizePhone(params.phone);
  const transactionRef = generateRef(12);
  const { password, timestamp } = buildPassword(env.MPESA_SHORTCODE, env.MPESA_PASSKEY);
  const base = MPESA_BASE[env.MPESA_ENV];

  try {
    const res = await fetch(`${base}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenResult.data}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(params.amountKES),
        PartyA: normalizedPhone,
        PartyB: env.MPESA_SHORTCODE,
        PhoneNumber: normalizedPhone,
        CallBackURL: env.MPESA_CALLBACK_URL,
        AccountReference: params.accountRef,
        TransactionDesc: params.description,
      }),
    });

    if (!res.ok) {
      if (attempt < 2) {
        await sleep(backoffDelay(attempt));
        return initiateSTKPush(params, attempt + 1);
      }
      return { ok: false, error: new MpesaError(`STK push failed: ${res.status}`, 'MPESA_STK_ERROR') };
    }

    const data = (await res.json()) as {
      CheckoutRequestID: string;
      MerchantRequestID: string;
    };

    return {
      ok: true,
      data: {
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
        transactionRef,
      },
    };
  } catch (err) {
    if (attempt < 2) {
      await sleep(backoffDelay(attempt));
      return initiateSTKPush(params, attempt + 1);
    }
    logger.error({ err }, 'STK push failed after retries');
    return { ok: false, error: new MpesaError('STK push failed', 'MPESA_STK_ERROR') };
  }
}

// ─── Callback parsing ─────────────────────────────────────────────────────────

export function parseCallback(rawBody: unknown): Result<CallbackResult> {
  const parsed = mpesaCallbackSchema.safeParse(rawBody);
  if (!parsed.success) {
    return { ok: false, error: new MpesaError('Invalid callback payload', 'MPESA_CALLBACK_INVALID') };
  }

  const { stkCallback } = parsed.data.Body;
  const success = stkCallback.ResultCode === 0;

  if (!success) {
    return {
      ok: true,
      data: { success: false, checkoutRequestId: stkCallback.CheckoutRequestID },
    };
  }

  const items = stkCallback.CallbackMetadata?.Item ?? [];
  const getItem = (name: string) => items.find((i) => i.Name === name)?.Value;

  return {
    ok: true,
    data: {
      success: true,
      checkoutRequestId: stkCallback.CheckoutRequestID,
      mpesaReceipt: String(getItem('MpesaReceiptNumber') ?? ''),
      amount: Number(getItem('Amount') ?? 0),
      phoneNumber: String(getItem('PhoneNumber') ?? ''),
      transactionDate: String(getItem('TransactionDate') ?? ''),
    },
  };
}
