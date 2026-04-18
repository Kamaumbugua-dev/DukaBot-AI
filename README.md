# DukaBot AI 🤖🛒

> WhatsApp-native AI sales agent for Kenyan SMEs.
> Customers browse, add to cart, and pay via M-Pesa — all through WhatsApp.

Built by **AxonLattice Labs**

---

## What it does

- 🗣️ **Conversational sales** — Claude AI speaks Kenglish (English + Swahili mix)
- 🔍 **Product search** — AI searches your catalog with natural language queries
- 🛒 **Cart & checkout** — full cart management via WhatsApp conversation
- 💳 **M-Pesa payments** — STK push triggered directly from chat
- 📊 **Merchant dashboard** — REST API for analytics, orders, settings
- 🛡️ **Security** — webhook signature validation, prompt injection guardrails, PII redaction

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 + TypeScript |
| Web framework | Express |
| AI | Anthropic Claude (Sonnet + Opus) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Payments | M-Pesa Daraja API |
| Messaging | WhatsApp Cloud API |
| Edge | Cloudflare Workers + WAF |
| Hosting | Railway |

---

## Quick Start

```bash
# 1. Start PostgreSQL + Redis
npm run docker:up

# 2. Configure environment
cp .env.example .env
# Edit .env — add your API keys

# 3. Run migrations & seed data
npm run migrate
npm run seed

# 4. Start server
npm run dev

# 5. Test DukaBot in your terminal (no WhatsApp needed)
npm run simulate
```

> For full deployment guide see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## API Reference

See [docs/openapi.yaml](docs/openapi.yaml) for the full OpenAPI spec.

Key endpoints:
- `GET /health` — service health
- `GET /webhook/whatsapp` — Meta verification
- `POST /webhook/whatsapp` — incoming messages
- `POST /mpesa/callback` — M-Pesa payment callbacks
- `POST /api/merchants` — register merchant
- `GET /api/merchants/:id/analytics` — sales analytics
- `PATCH /api/merchants/:id/orders/:orderId/status` — update order

---

## Project Structure

```
src/
├── ai/           # Claude agent, prompts, tools, guardrails
├── commerce/     # Cart, catalog, orders, M-Pesa
├── config/       # Env validation, DB, Redis
├── customers/    # Customer profiles
├── merchants/    # Onboarding, settings, analytics, routes
├── shared/       # Logger, errors, utils, validators
├── types/        # TypeScript types
├── whatsapp/     # Webhook, sender, templates
└── index.ts      # Express server entry point
```

---

## Tests

```bash
npm run test              # All tests
npm run test:unit         # Unit tests only
npm run test:coverage     # With coverage report
```

**95 tests** across unit + integration layers.

---

## Development Commands

```bash
npm run dev          # Start with hot reload
npm run build        # TypeScript compile
npm run simulate     # Chat with DukaBot in terminal
npm run migrate      # Run DB migrations
npm run seed         # Load sample products
npm run docker:up    # Start local DB + Redis
npm run docker:down  # Stop local DB + Redis
```

---

## License

MIT — AxonLattice Labs
