/**
 * Cloudflare Worker — Webhook pre-validation at the edge
 * Validates HMAC-SHA256 signatures before requests hit the origin.
 * Invalid requests are rejected at the CDN level — never reach the server.
 */

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 100; // per phone number

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only pre-validate WhatsApp webhook POSTs
    if (request.method === 'POST' && url.pathname === '/webhook/whatsapp') {
      const signature = request.headers.get('x-hub-signature-256');
      if (!signature) {
        return new Response(JSON.stringify({ error: 'Missing signature' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const body = await request.clone().arrayBuffer();
      const valid = await verifySignature(body, signature, env.WHATSAPP_APP_SECRET);

      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Rate limiting by sender phone (extracted from payload)
      const rateLimited = await checkRateLimit(body, env);
      if (rateLimited) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // Forward to origin
    return fetch(request);
  },
};

async function verifySignature(body, signature, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const sigHex = signature.replace('sha256=', '');
  const sigBytes = hexToBytes(sigHex);

  return crypto.subtle.verify('HMAC', key, sigBytes, body);
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function checkRateLimit(body, env) {
  if (!env.RATE_LIMIT_KV) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(body));
    const phone = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
    if (!phone) return false;

    const key = `rl:${phone}:${Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS)}`;
    const count = parseInt((await env.RATE_LIMIT_KV.get(key)) ?? '0');

    if (count >= RATE_LIMIT_MAX) return true;

    await env.RATE_LIMIT_KV.put(key, String(count + 1), { expirationTtl: 120 });
    return false;
  } catch {
    return false;
  }
}
