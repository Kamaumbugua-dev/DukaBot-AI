import { env } from '../config/env';
import { logger } from '../shared/logger';
import { WhatsAppError } from '../shared/errors';
import { sleep, backoffDelay } from '../shared/utils';
import type { MessageId } from '../types/whatsapp';

type Result<T> = { ok: true; data: T } | { ok: false; error: WhatsAppError };

const WA_API_BASE = 'https://graph.facebook.com/v19.0';
const MAX_RETRIES = 3;

async function callWhatsAppAPI(
  phoneNumberId: string,
  body: Record<string, unknown>,
  attempt = 0,
): Promise<Result<MessageId>> {
  const url = `${WA_API_BASE}/${phoneNumberId}/messages`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new WhatsAppError(
        `WhatsApp API error: ${res.status}`,
        `WA_HTTP_${res.status}`,
      );
    }

    const data = (await res.json()) as { messages?: Array<{ id: string }> };
    const messageId = data.messages?.[0]?.id ?? 'unknown';
    return { ok: true, data: { messageId } };
  } catch (err) {
    if (attempt < MAX_RETRIES - 1) {
      await sleep(backoffDelay(attempt));
      return callWhatsAppAPI(phoneNumberId, body, attempt + 1);
    }

    logger.error({ err }, 'WhatsApp API call failed after retries');
    return {
      ok: false,
      error: err instanceof WhatsAppError ? err : new WhatsAppError('Send failed'),
    };
  }
}

export async function sendTextMessage(params: {
  to: string;
  body: string;
  merchantPhoneId?: string;
  replyTo?: string;
}): Promise<Result<MessageId>> {
  const phoneId = params.merchantPhoneId ?? env.WHATSAPP_PHONE_ID;

  // WhatsApp max message length
  const body = params.body.slice(0, 4096);

  return callWhatsAppAPI(phoneId, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: params.to,
    type: 'text',
    text: { body },
    ...(params.replyTo ? { context: { message_id: params.replyTo } } : {}),
  });
}

export async function sendInteractiveList(params: {
  to: string;
  bodyText: string;
  buttonLabel: string;
  sections: Array<{
    title: string;
    rows: Array<{ id: string; title: string; description?: string }>;
  }>;
  merchantPhoneId?: string;
}): Promise<Result<MessageId>> {
  const phoneId = params.merchantPhoneId ?? env.WHATSAPP_PHONE_ID;

  return callWhatsAppAPI(phoneId, {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: params.to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: params.bodyText },
      action: {
        button: params.buttonLabel,
        sections: params.sections,
      },
    },
  });
}

export async function sendTemplateMessage(params: {
  to: string;
  templateName: string;
  languageCode: string;
  components?: unknown[];
  merchantPhoneId?: string;
}): Promise<Result<MessageId>> {
  const phoneId = params.merchantPhoneId ?? env.WHATSAPP_PHONE_ID;

  return callWhatsAppAPI(phoneId, {
    messaging_product: 'whatsapp',
    to: params.to,
    type: 'template',
    template: {
      name: params.templateName,
      language: { code: params.languageCode },
      components: params.components ?? [],
    },
  });
}
