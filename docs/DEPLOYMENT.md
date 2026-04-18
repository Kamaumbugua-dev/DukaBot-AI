# DukaBot AI — Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Railway account (production)
- Cloudflare account (WAF/DNS)
- WhatsApp Business API access (Meta)
- Safaricom M-Pesa Daraja API credentials

---

## Local Development

### 1. Start dependencies
```bash
npm run docker:up
# Starts PostgreSQL 16 + Redis 7
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in all required values
```

### 3. Run migrations & seed
```bash
npm run migrate
npm run seed
```

### 4. Start the server
```bash
npm run dev
# Server at http://localhost:3000
```

### 5. Test with the chat simulator
```bash
npm run simulate
# Add your real ANTHROPIC_API_KEY to .env first
```

### 6. Expose for WhatsApp webhook (use ngrok)
```bash
ngrok http 3000
# Set ngrok URL as webhook in Meta App Dashboard
```

---

## Production Deployment (Railway)

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### 2. Create project
```bash
railway init
railway add --name postgres  # PostgreSQL managed
railway add --name redis      # Redis managed
```

### 3. Set environment variables
```bash
railway variables set NODE_ENV=production
railway variables set WHATSAPP_TOKEN=your_token
railway variables set ANTHROPIC_API_KEY=your_key
# ... set all required vars from .env.example
```

### 4. Deploy
```bash
railway up
```

### 5. Run migrations in production
```bash
railway run npm run migrate
```

---

## Cloudflare Setup

### 1. Add Worker
- Create a new Worker in Cloudflare dashboard
- Copy `infra/cloudflare/worker.js` content
- Set environment variable: `WHATSAPP_APP_SECRET`
- Create a KV namespace: `RATE_LIMIT_KV`
- Bind KV to worker as `RATE_LIMIT_KV`

### 2. Configure routes
```
Route: dukabot.axonlattice.com/webhook/whatsapp → Worker
Route: dukabot.axonlattice.com/* → Railway origin
```

---

## WhatsApp Business API Setup

1. Create Meta App at developers.facebook.com
2. Add WhatsApp product to app
3. Get Phone Number ID and generate permanent token
4. Configure webhook:
   - URL: `https://dukabot.axonlattice.com/webhook/whatsapp`
   - Verify token: value of `WHATSAPP_VERIFY_TOKEN`
   - Subscribe to: `messages`

---

## M-Pesa Daraja API Setup

1. Register at developer.safaricom.co.ke
2. Create an app and get Consumer Key/Secret
3. Go Live to get production credentials
4. Register callback URL:
   ```
   https://dukabot.axonlattice.com/mpesa/callback
   ```

---

## Security Checklist

- [ ] All env vars set (never commit .env)
- [ ] WhatsApp webhook signature validation active
- [ ] M-Pesa callback IP whitelist configured
- [ ] Rate limiting active (Cloudflare Worker)
- [ ] HTTPS enforced (Cloudflare Full Strict SSL)
- [ ] Database connection encrypted
- [ ] PII redaction active in logs
- [ ] No console.log statements in production code
- [ ] SQL parameterized queries only (no string concat)
- [ ] Error responses don't expose stack traces

---

## Monitoring

### Key metrics to watch
- Webhook response time (alert if p95 > 10s)
- M-Pesa success rate (alert if < 90%)
- Claude API error rate (alert if > 5% in 5min)
- Redis cache hit ratio

### Useful commands
```bash
# View live logs
railway logs --tail

# Check health
curl https://dukabot.axonlattice.com/health

# View metrics
railway metrics
```
