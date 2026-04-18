import { db } from '../config/database';
import { logger } from '../shared/logger';
import { AppError, ValidationError } from '../shared/errors';
import { normalizePhone } from '../shared/utils';
import type { Merchant } from '../types/commerce';

type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };

type DbMerchant = {
  id: string;
  business_name: string;
  phone: string;
  wa_phone_id?: string;
  mpesa_shortcode?: string;
  location?: string;
  settings: Record<string, unknown>;
  plan: string;
  created_at: Date;
};

function mapMerchant(row: DbMerchant): Merchant {
  return {
    id: row.id,
    businessName: row.business_name,
    phone: row.phone,
    waPhoneId: row.wa_phone_id ?? '',
    mpesaShortcode: row.mpesa_shortcode,
    location: row.location,
    settings: row.settings as Merchant['settings'],
    plan: row.plan as Merchant['plan'],
    createdAt: row.created_at,
  };
}

export async function getMerchantByPhone(phone: string): Promise<Result<Merchant>> {
  try {
    const normalized = normalizePhone(phone);
    const { rows } = await db.query<DbMerchant>(
      'SELECT * FROM merchants WHERE phone = $1',
      [normalized],
    );
    const row = rows[0];
    if (!row) return { ok: false, error: new AppError('Merchant not found', 'NOT_FOUND', 404) };
    return { ok: true, data: mapMerchant(row) };
  } catch (err) {
    logger.error({ err }, 'getMerchantByPhone failed');
    return { ok: false, error: new AppError('Merchant lookup failed', 'MERCHANT_ERROR') };
  }
}

export async function getMerchantById(id: string): Promise<Result<Merchant>> {
  try {
    const { rows } = await db.query<DbMerchant>('SELECT * FROM merchants WHERE id = $1', [id]);
    const row = rows[0];
    if (!row) return { ok: false, error: new AppError('Merchant not found', 'NOT_FOUND', 404) };
    return { ok: true, data: mapMerchant(row) };
  } catch (err) {
    logger.error({ err }, 'getMerchantById failed');
    return { ok: false, error: new AppError('Merchant lookup failed', 'MERCHANT_ERROR') };
  }
}

export async function registerMerchant(params: {
  businessName: string;
  phone: string;
  waPhoneId: string;
  mpesaShortcode?: string;
  location?: string;
}): Promise<Result<Merchant>> {
  if (!params.businessName.trim()) {
    return { ok: false, error: new ValidationError('Business name is required') };
  }

  try {
    const normalized = normalizePhone(params.phone);
    const { rows } = await db.query<DbMerchant>(
      `INSERT INTO merchants (business_name, phone, wa_phone_id, mpesa_shortcode, location)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (phone) DO UPDATE
         SET business_name = EXCLUDED.business_name,
             wa_phone_id   = EXCLUDED.wa_phone_id,
             updated_at    = NOW()
       RETURNING *`,
      [params.businessName.trim(), normalized, params.waPhoneId, params.mpesaShortcode ?? null, params.location ?? null],
    );
    const row = rows[0];
    if (!row) return { ok: false, error: new AppError('Registration failed', 'MERCHANT_CREATE_ERROR') };
    logger.info({ merchantId: row.id }, 'Merchant registered');
    return { ok: true, data: mapMerchant(row) };
  } catch (err) {
    logger.error({ err }, 'registerMerchant failed');
    return { ok: false, error: new AppError('Registration failed', 'MERCHANT_CREATE_ERROR') };
  }
}

// ─── WhatsApp-based onboarding state machine ──────────────────────────────────
// Stored in Redis: onboard:{phone} → current step

export type OnboardingStep =
  | 'ask_business_name'
  | 'ask_location'
  | 'ask_mpesa_code'
  | 'confirm'
  | 'complete';

export type OnboardingState = {
  step: OnboardingStep;
  phone: string;
  businessName?: string;
  location?: string;
  mpesaShortcode?: string;
};

export function getNextOnboardingMessage(state: OnboardingState, input?: string): {
  reply: string;
  nextState: OnboardingState;
} {
  switch (state.step) {
    case 'ask_business_name': {
      if (!input?.trim()) {
        return {
          reply: 'Karibu! 👋 Tutakusaidia kusanidi duka lako.\n\nJina la biashara yako ni nini?',
          nextState: state,
        };
      }
      return {
        reply: `Sawa, *${input.trim()}*! 🔥\n\nDuka lako liko wapi? (e.g., "Luthuli Avenue, Nairobi")`,
        nextState: { ...state, step: 'ask_location', businessName: input.trim() },
      };
    }

    case 'ask_location': {
      return {
        reply: `Sawa! 📍\n\nM-Pesa Till/Paybill number yako ni nini? (Customers watalipa hapa)`,
        nextState: { ...state, step: 'ask_mpesa_code', location: input?.trim() },
      };
    }

    case 'ask_mpesa_code': {
      return {
        reply: [
          `✅ Asante! Hizi ndizo details zako:`,
          ``,
          `*Biashara:* ${state.businessName}`,
          `*Mahali:* ${state.location ?? 'Online'}`,
          `*M-Pesa:* ${input?.trim() ?? 'Sijaset'}`,
          ``,
          `Sahihi? Reply *"Ndiyo"* kuthibitisha au *"Hapana"* kuanza tena.`,
        ].join('\n'),
        nextState: { ...state, step: 'confirm', mpesaShortcode: input?.trim() },
      };
    }

    case 'confirm': {
      const confirmed = /^(ndiyo|yes|y|sawa|ok)/i.test(input ?? '');
      if (confirmed) {
        return {
          reply: [
            `🎉 *Hongera! Duka lako limeanzishwa!*`,
            ``,
            `DukaBot itaanza kusaidia wateja wako kupitia WhatsApp sasa hivi.`,
            ``,
            `Ongeza bidhaa yako ya kwanza kwa kutuma:`,
            `*"add product"*`,
          ].join('\n'),
          nextState: { ...state, step: 'complete' },
        };
      }
      return {
        reply: `Sawa, tuanze tena. Jina la biashara yako ni nini?`,
        nextState: { ...state, step: 'ask_business_name', businessName: undefined, location: undefined, mpesaShortcode: undefined },
      };
    }

    default:
      return {
        reply: 'Duka lako tayari limesanidiwa! ✅',
        nextState: state,
      };
  }
}
