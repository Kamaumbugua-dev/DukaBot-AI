# DukaBot AI

**WhatsApp-native AI sales agent for Kenyan SMEs.**  
Customers browse your catalog, build a cart, and pay via M-Pesa — entirely inside WhatsApp. No app download, no website visit, no manual replies from you.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Feature Deep-Dive](#feature-deep-dive)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [AI Agent Design](#ai-agent-design)
- [WhatsApp Integration](#whatsapp-integration)
- [M-Pesa Integration](#m-pesa-integration)
- [Merchant Dashboard](#merchant-dashboard)
- [Security](#security)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Overview

Kenyan small business owners conduct the majority of their commerce through WhatsApp. They send product photos manually, negotiate prices in DMs, and collect M-Pesa payments by sharing their Paybill number — all done by hand, one message at a time.

DukaBot AI automates this entire flow. A merchant onboards once (uploads their product catalog, connects their WhatsApp Business number, links their M-Pesa shortcode) and DukaBot handles every customer conversation from that point forward:

1. Customer sends a message ("niambie bei ya blender" / "what phones do you have under 15k?")
2. DukaBot searches the catalog and replies with matching products, prices, and images
3. Customer adds items to their cart through natural conversation
4. DukaBot collects the delivery address, shows an order summary, and triggers an M-Pesa STK Push
5. Customer enters their M-Pesa PIN
6. Safaricom's Daraja API sends a callback confirming payment
7. DukaBot marks the order as paid and sends a receipt — all automatically

The merchant sees every order, customer, and payment on the React merchant dashboard in real time.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Customer (WhatsApp)                           │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ HTTPS
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Cloudflare WAF / CDN                            │
│              Rate limiting · Bot protection · DDoS shield               │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Express API (Node.js / TS)                        │
│                                                                         │
│  POST /webhook/whatsapp ──► HMAC-SHA256 signature validation            │
│         │                                                               │
│         ▼                                                               │
│  Guardrail Layer ──► Injection detection · Escalation · Scope check     │
│         │                                                               │
│         ▼                                                               │
│  Claude AI Agent (Anthropic SDK)                                        │
│    ├── search_products      ──► PostgreSQL full-text search             │
│    ├── get_product_details  ──► PostgreSQL                              │
│    ├── add_to_cart          ──► Redis session                           │
│    ├── remove_from_cart     ──► Redis session                           │
│    ├── view_cart            ──► Redis session                           │
│    ├── initiate_checkout    ──► PostgreSQL order creation               │
│    └── initiate_payment     ──► Safaricom Daraja STK Push              │
│         │                                                               │
│         ▼                                                               │
│  POST /mpesa/callback ──► Daraja callback · Order status update         │
│                                                                         │
└─────┬───────────────────────────────────────────────────────┬───────────┘
      │                                                       │
      ▼                                                       ▼
┌──────────────┐                                    ┌──────────────────────┐
│  PostgreSQL  │                                    │     Redis Cache      │
│  (Railway)   │                                    │    (Railway)         │
│              │                                    │                      │
│  merchants   │                                    │  Cart sessions       │
│  customers   │                                    │  M-Pesa OAuth token  │
│  products    │                                    │  Conversation ctx    │
│  orders      │                                    └──────────────────────┘
│  conversations│
└──────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                    Merchant Dashboard (React / Vite)                    │
│  Overview · Orders · Analytics · Customers · Settings · Testimonials    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Feature Deep-Dive

### Conversational Sales

The Claude AI agent speaks fluent Kenglish — the natural English-Swahili mix used in everyday Kenyan commerce. When a customer says *"Niambie bei ya hii"* or *"Iko Samsung TV under 50k?"*, DukaBot understands and responds naturally, using WhatsApp formatting (`*bold*` for prices) and Kenyan expressions (*"Hiyo ni deal safi!"*).

Messages are kept short (3–4 sentences) because this is WhatsApp, not email.

### Product Discovery

The `search_products` tool runs against the merchant's PostgreSQL catalog with:
- Keyword and category filtering
- Price range constraints (`min_price` / `max_price`)
- Stock availability filtering (out-of-stock items are excluded)

Returns up to 10 matching products with name, price (KES), and availability.

### Cart Management

Cart state is stored in Redis, keyed by the customer's phone number. Customers can add items, remove items, view their cart, and modify quantities through natural conversation. The cart expires after 30 minutes of inactivity.

Maximum 20 items per cart. Stock is validated on `add_to_cart` to prevent overselling.

### M-Pesa STK Push Checkout

When the customer confirms their order:

1. DukaBot calls the `initiate_payment` tool
2. The backend calls Safaricom Daraja's `/mpesa/stkpush/v1/processrequest`
3. The customer's phone displays an M-Pesa PIN prompt
4. On payment, Daraja sends a callback to `POST /mpesa/callback`
5. The backend verifies the callback, matches it to the pending order via `checkoutRequestId`, and updates the order status to `PAID`
6. DukaBot sends a receipt message to the customer via WhatsApp

The OAuth access token (required by Daraja for all API calls) is cached in Redis with a 55-minute TTL and refreshed automatically before expiry.

Supports both **Paybill** (businesses) and **Buy Goods / Till** number configurations.

### Human Escalation

The guardrail layer detects escalation triggers in customer messages (complaints about defects, refund demands, threats of legal action, requests to speak to a human) and responds with a handoff message instead of attempting an AI resolution. Escalated conversations are flagged in the dashboard.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Runtime | Node.js 20 + TypeScript | Strict mode, ESM |
| Framework | Express 5 | Async error handling |
| AI | Anthropic Claude SDK | Sonnet for standard, Opus for complex queries |
| Database | PostgreSQL 16 | Full-text search, JSONB settings |
| Cache | Redis 7 | Cart sessions, OAuth tokens, conversation context |
| Payments | Safaricom Daraja API v2 | STK Push, OAuth 2.0 |
| Messaging | Meta WhatsApp Cloud API | Webhook, templates, interactive messages |
| Validation | Zod | Schema validation on all API inputs and webhook payloads |
| Logging | Pino | Structured JSON logs with request IDs |
| Testing | Vitest | Unit + integration |
| Dashboard | Vite + React 19 + TypeScript | shadcn/ui, Tailwind v4, Recharts |
| Hosting | Railway | Backend + Postgres + Redis |
| Edge | Cloudflare Workers + WAF | Rate limiting, DDoS protection |

---

## Project Structure

```
dukabot-ai/
│
├── src/
│   ├── ai/
│   │   ├── agent.ts          # Main AI agent loop — tool call orchestration
│   │   ├── context.ts        # Conversation history builder, model selector
│   │   ├── guardrails.ts     # Injection detection, escalation, PII, scope
│   │   ├── prompts.ts        # System prompt builder (merchant-specific)
│   │   └── tools.ts          # Anthropic tool definitions (6 tools)
│   │
│   ├── commerce/
│   │   ├── cart.ts           # Cart state machine (add/remove/validate)
│   │   ├── catalog.ts        # Product search and detail queries
│   │   ├── mpesa.ts          # Daraja OAuth, STK Push, callback parsing
│   │   ├── orders.ts         # Order creation and status management
│   │   └── pricing.ts        # Total calculation, discount application
│   │
│   ├── config/
│   │   ├── database.ts       # PostgreSQL pool with health check
│   │   ├── env.ts            # Zod-validated environment variables
│   │   └── redis.ts          # Redis client with reconnect logic
│   │
│   ├── customers/
│   │   └── profiles.ts       # Customer upsert, profile retrieval
│   │
│   ├── merchants/
│   │   ├── analytics.ts      # Revenue, orders, and conversion queries
│   │   ├── onboarding.ts     # Merchant registration flow
│   │   ├── routes.ts         # Express router for /api/* endpoints
│   │   └── settings.ts       # Merchant configuration management
│   │
│   ├── shared/
│   │   ├── errors.ts         # Typed error classes (AppError, MpesaError…)
│   │   ├── logger.ts         # Pino logger with request-ID context
│   │   ├── utils.ts          # Phone normalisation, ref generation, retry
│   │   └── validators.ts     # Shared Zod schemas
│   │
│   ├── types/
│   │   ├── ai.ts             # ConversationContext, AgentResponse, ToolName
│   │   ├── commerce.ts       # Product, Order, CartState, OrderStatus
│   │   └── whatsapp.ts       # Webhook event types
│   │
│   ├── whatsapp/
│   │   ├── sender.ts         # WhatsApp message sending (text, template)
│   │   ├── templates.ts      # Receipt, order confirmation templates
│   │   └── webhook.ts        # Webhook verification, HMAC validation, parsing
│   │
│   └── index.ts              # Express server entry — routes, middleware, boot
│
├── dashboard/                # React merchant dashboard (separate Vite app)
│   └── src/
│       ├── components/       # Footer, sidebar, avatar-group, pricing-card,
│       │                     # water-ripple (WebGL), empty-testimonial
│       ├── pages/            # Overview, Orders, Analytics, Customers,
│       │                     # Settings, Testimonials, Login, About,
│       │                     # How It Works, Features, Docs, Legal, Help
│       └── App.tsx           # Client-side routing, auth gate
│
├── migrations/               # Sequential SQL migration files
│   ├── 001_create_merchants.sql
│   ├── 002_create_customers.sql
│   ├── 003_create_products.sql
│   ├── 004_create_orders.sql
│   ├── 005_create_conversations.sql
│   └── 006_add_delivery_notes.sql
│
├── tests/
│   ├── unit/                 # Per-module unit tests
│   └── fixtures/             # WhatsApp and M-Pesa payload fixtures
│
├── scripts/
│   ├── migrate.ts            # Runs migrations in order
│   ├── seed-catalog.ts       # Seeds sample product catalog
│   └── simulate-chat.ts     # Terminal chat simulator (no WhatsApp needed)
│
├── infra/
│   ├── docker-compose.yml    # Local PostgreSQL 16 + Redis 7
│   ├── Dockerfile            # Production container
│   ├── railway/              # Railway deployment config
│   └── cloudflare/           # Cloudflare Worker (edge proxy)
│
├── docs/
│   ├── DEPLOYMENT.md         # Step-by-step production deployment guide
│   └── openapi.yaml          # Full OpenAPI 3.0 specification
│
├── .env.example              # All required environment variables documented
├── package.json
└── tsconfig.json
```

---

## Database Schema

Six migrations run sequentially to build the schema:

```
merchants          — Business profile, WhatsApp config, M-Pesa shortcode, AI settings
customers          — Customer profiles keyed by normalised phone number
products           — Catalog items with full-text search vector, stock levels
orders             — Order header with M-Pesa checkout request ID and status
order_items        — Line items linked to orders and products
conversations      — Per-customer message history for AI context window
```

**Order lifecycle:**

```
pending → payment_initiated → paid → shipped → delivered
                           ↘ payment_failed
```

M-Pesa `checkoutRequestId` is stored on the order at `payment_initiated`. When the Daraja callback arrives, the backend matches on this field to identify the order and update its status.

---

## AI Agent Design

### Model Selection

DukaBot uses two Claude models depending on conversation complexity:

| Model | Used when |
|---|---|
| `claude-sonnet-4-6` | Standard product queries, cart management |
| `claude-opus-4-6` | Complex multi-product comparisons, lengthy conversation history |

The `selectModel()` function in `src/ai/context.ts` chooses based on conversation length and detected complexity signals.

### Tool Loop

The agent runs an iterative tool-use loop with a hard cap of **10 tool calls per message** and a **30-second timeout**. This prevents runaway loops while allowing multi-step operations (e.g., search → get details → add to cart in a single customer turn).

```
User message
    │
    ▼
Guardrail checks (injection / escalation / scope)
    │
    ▼
Build system prompt (merchant-specific)
Build conversation history (sliding window)
    │
    ▼
Claude API call ──► Tool call? ──► Execute tool ──► Append result
                       │ (loop up to 10×)
                       ▼
                 Text response
                       │
                       ▼
                 PII output check
                       │
                       ▼
              Send via WhatsApp Cloud API
```

### The 6 Tools

| Tool | Purpose |
|---|---|
| `search_products` | Full-text catalog search with category and price filters |
| `get_product_details` | Full product info including description, specs, stock |
| `add_to_cart` | Adds a validated product to the Redis cart session |
| `remove_from_cart` | Removes a line item from the cart |
| `view_cart` | Returns current cart contents with subtotal |
| `initiate_payment` | Creates the order record and triggers Daraja STK Push |

### Guardrail Layer (`src/ai/guardrails.ts`)

Four independent checks run on every message:

| Check | Trigger | Response |
|---|---|---|
| **Prompt injection** | "ignore previous instructions", "act as", "DAN mode" etc. | Fixed refusal message |
| **Escalation** | Complaints, refund demands, legal threats, "speak to human" | Handoff to merchant |
| **Out of scope** | Medical/legal advice requests | Fixed decline message |
| **PII output** | Kenyan phone numbers, "mpesa pin", "api key" in AI response | Response blocked |

---

## WhatsApp Integration

### Webhook Verification

Meta sends a `GET /webhook/whatsapp` with a `hub.verify_token` challenge when you first register the webhook. The handler in `src/whatsapp/webhook.ts` responds with the challenge if the token matches `WHATSAPP_VERIFY_TOKEN`.

### Payload Validation

Every incoming `POST /webhook/whatsapp` is validated using HMAC-SHA256:

```
X-Hub-Signature-256: sha256=<hex>
```

The signature is computed over the raw request body using `WHATSAPP_APP_SECRET`. Requests with invalid or missing signatures are rejected with HTTP 401 before any payload parsing occurs. The comparison uses Node.js `timingSafeEqual` to prevent timing attacks.

### Message Types Handled

| Type | Handling |
|---|---|
| `text` | Passed to AI agent |
| `interactive / button_reply` | Parsed and passed to AI agent as text |
| `interactive / list_reply` | Parsed and passed to AI agent as text |
| `image` | Caption extracted and passed to AI agent |
| `status` | Delivery receipts — logged, not processed |

---

## M-Pesa Integration

### OAuth Token Management

Daraja requires a Bearer token for all API calls. DukaBot fetches this token on first use and caches it in Redis with a **55-minute TTL** (Safaricom tokens expire after 60 minutes). Subsequent calls reuse the cached token. If the cache misses, a fresh token is fetched automatically.

### STK Push Flow

```
1. POST /mpesa/stkpush/v1/processrequest
   ├── BusinessShortCode
   ├── Password (base64 of ShortCode + Passkey + Timestamp)
   ├── Timestamp (YYYYMMDDHHmmss)
   ├── TransactionType (CustomerPayBillOnline / CustomerBuyGoodsOnline)
   ├── Amount
   ├── PartyA (customer phone, normalised to 254XXXXXXXXX format)
   ├── PartyB (merchant shortcode)
   ├── PhoneNumber (customer phone)
   ├── CallBackURL
   └── AccountReference / TransactionDesc

2. Safaricom responds with CheckoutRequestID
   └── Stored on the order record

3. Customer receives PIN prompt on their phone

4. POST /mpesa/callback (Daraja → DukaBot)
   └── Matched to order via CheckoutRequestID
       ├── ResultCode 0 → PAID (MpesaReceiptNumber stored)
       └── ResultCode != 0 → payment_failed
```

### Phone Normalisation

All phone numbers are normalised to the international `254XXXXXXXXX` format before any Daraja API call. The `normalizePhone()` utility in `src/shared/utils.ts` handles `07XX`, `+254XX`, and `254XX` inputs.

---

## Merchant Dashboard

A standalone **Vite + React 19** application in the `dashboard/` directory.

### Pages

| Page | Description |
|---|---|
| **Login** | WebGL water-ripple background, liquid glass card, Google SSO placeholder |
| **Overview** | KES revenue chart, AI performance stats, recent orders, active customers |
| **Orders** | Full order table with status badges and M-Pesa receipt lookup |
| **Analytics** | Recharts area/bar charts for revenue trends and conversion |
| **Customers** | Customer list with VIP/active/new segmentation |
| **Settings** | Merchant info, integrations status, AI config, animated subscription plan picker |
| **Testimonials** | Empty state → add form → testimonial card grid |
| **About / How It Works / Features / Docs / Legal / Help** | Public-facing content pages accessible via the footer |

### Notable Components

- **`WaterRipple`** — Custom WebGL fragment shader rendering pearl/silver water ripples. Supports up to 8 simultaneous interactive ripples with dual-ring animation and per-ripple amplitude and decay. Exposed via `forwardRef` so parent components can trigger ripples programmatically.
- **`PricingCard`** — Animated plan selector with monthly/yearly billing toggle, animated selection state, and per-seat user count control.
- **`AvatarGroup` + `AvatarMore`** — Overlapping avatar stack with overflow count badge, used on the Overview page to surface recently active customers.
- **`EmptyTestimonial`** — Animated folder/envelope empty state that fans out on click.
- **`Footer`** — Fully navigable footer with 6 sections and 18 internal links, dark-mode toggle via `.dark` class, and social links.

---

## Security

| Concern | Mitigation |
|---|---|
| Webhook spoofing | HMAC-SHA256 verification on every WhatsApp webhook payload using `timingSafeEqual` |
| Prompt injection | Regex-based guardrail layer runs before AI agent on every message |
| PII leakage | Output guardrail blocks AI responses containing phone numbers, M-Pesa PINs, or API keys |
| Environment secrets | Zod schema validates all required env vars at startup — server refuses to boot with missing config |
| M-Pesa credentials | Never logged, never passed to the AI agent, stored only in environment variables |
| SQL injection | All database queries use parameterised statements via `node-postgres` |
| Rate limiting | Cloudflare WAF rules applied at the edge before requests reach Express |
| Request tracing | Each request is tagged with a `UUID` (attached in middleware, logged by Pino) for incident tracing |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose (for local PostgreSQL and Redis)
- A [Meta Business](https://developers.facebook.com/) app with WhatsApp Cloud API access
- A [Safaricom Daraja](https://developer.safaricom.co.ke/) developer account
- An [Anthropic API key](https://console.anthropic.com/)

### 1. Clone and install

```bash
git clone https://github.com/Kamaumbugua-dev/DukaBot-AI.git
cd DukaBot-AI
npm install
```

### 2. Start local infrastructure

```bash
npm run docker:up
# PostgreSQL available on port 5555
# Redis available on port 6379
```

### 3. Configure environment

```bash
cp .env.example .env
# Open .env and fill in your API keys (see Environment Variables below)
```

### 4. Run database migrations

```bash
npm run migrate
# Runs 001 through 006 in order
```

### 5. Seed the product catalog

```bash
npm run seed
# Loads a sample electronics catalog for testing
```

### 6. Start the development server

```bash
npm run dev
# Server running on http://localhost:3000
```

### 7. Simulate a customer chat (no WhatsApp needed)

```bash
npm run simulate
# Interactive terminal session — type customer messages and see DukaBot respond
```

### 8. Start the merchant dashboard

```bash
cd dashboard
npm install
npm run dev
# Dashboard running on http://localhost:5173
```

---

## Environment Variables

All variables are validated at startup using Zod. The server will not start if any required variable is missing or malformed.

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development` or `production` |
| `PORT` | Yes | HTTP server port (default: `3000`) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | Yes | Redis connection string |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key |
| `CLAUDE_MODEL` | No | Claude model for standard queries (default: `claude-sonnet-4-6`) |
| `CLAUDE_MODEL_COMPLEX` | No | Claude model for complex queries (default: `claude-opus-4-6`) |
| `WHATSAPP_TOKEN` | Yes | Meta permanent access token |
| `WHATSAPP_PHONE_ID` | Yes | WhatsApp Business phone number ID |
| `WHATSAPP_VERIFY_TOKEN` | Yes | Webhook verification token (you choose this) |
| `WHATSAPP_APP_SECRET` | Yes | Meta app secret for HMAC-SHA256 signature validation |
| `MPESA_CONSUMER_KEY` | Yes | Safaricom Daraja consumer key |
| `MPESA_CONSUMER_SECRET` | Yes | Safaricom Daraja consumer secret |
| `MPESA_SHORTCODE` | Yes | M-Pesa Paybill or Till number |
| `MPESA_PASSKEY` | Yes | Daraja online passkey (from Safaricom portal) |
| `MPESA_ENV` | Yes | `sandbox` or `production` |
| `MPESA_CALLBACK_URL` | Yes | Public HTTPS URL for Daraja payment callbacks |
| `CF_ZONE_ID` | No | Cloudflare zone ID (for edge worker deployment) |
| `CF_API_TOKEN` | No | Cloudflare API token |

---

## API Reference

Full OpenAPI 3.0 specification: [`docs/openapi.yaml`](docs/openapi.yaml)

### System

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health — returns DB, Redis, and uptime status |

### WhatsApp Webhook

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/webhook/whatsapp` | Meta webhook verification challenge handler |
| `POST` | `/webhook/whatsapp` | Incoming WhatsApp messages and status updates |

### M-Pesa

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/mpesa/callback` | Safaricom Daraja STK Push payment callback |

### Merchant API (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/merchants` | Register a new merchant |
| `GET` | `/api/merchants/:id` | Get merchant profile |
| `PATCH` | `/api/merchants/:id/settings` | Update AI and store configuration |
| `GET` | `/api/merchants/:id/analytics` | Revenue, order count, and conversion data |
| `GET` | `/api/merchants/:id/orders` | List orders (filterable by status) |
| `PATCH` | `/api/merchants/:id/orders/:orderId/status` | Manually update an order status |
| `GET` | `/api/merchants/:id/customers` | List customers with segmentation |
| `GET` | `/api/merchants/:id/catalog` | List all products |
| `POST` | `/api/merchants/:id/catalog` | Add a product to the catalog |
| `PATCH` | `/api/merchants/:id/catalog/:productId` | Update a product |
| `DELETE` | `/api/merchants/:id/catalog/:productId` | Remove a product |

---

## Testing

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:int

# E2E tests
npm run test:e2e

# With coverage report
npm run test:coverage

# Watch mode (re-runs on file change)
npm run test:watch
```

Tests use **Vitest** with real fixture payloads for both WhatsApp Cloud API and Safaricom Daraja callbacks, sourced from `tests/fixtures/`.

Key test areas:
- `tests/unit/ai/` — Guardrail detection, prompt building, tool definitions
- `tests/unit/commerce/` — Cart state machine, pricing calculation, M-Pesa parsing
- `tests/unit/whatsapp/` — Webhook signature validation, payload parsing, template rendering
- `tests/unit/merchants/` — Onboarding flow, settings validation
- `tests/unit/shared/` — Error classes, utility functions

---

## Deployment

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full step-by-step guide.

**Quick overview:**

```bash
# 1. Build TypeScript
npm run build

# 2. Build dashboard
cd dashboard && npm run build && cd ..

# 3. Deploy backend to Railway
#    Set all environment variables in Railway dashboard
#    Run migrations: npm run migrate

# 4. Configure Cloudflare Worker (optional edge proxy)
#    Deploy infra/cloudflare/worker.js to Cloudflare Workers

# 5. Register WhatsApp webhook
#    URL: https://your-api-domain.com/webhook/whatsapp
#    Verify token: your WHATSAPP_VERIFY_TOKEN
```

Production checklist:
- [ ] `MPESA_ENV=production` (not `sandbox`)
- [ ] Daraja callback URL is a public HTTPS endpoint
- [ ] WhatsApp webhook registered and verified
- [ ] `NODE_ENV=production`
- [ ] Cloudflare WAF rules enabled
- [ ] Database backups configured in Railway

---

## Development Commands

```bash
npm run dev           # Start API server with hot reload (tsx watch)
npm run build         # Compile TypeScript to dist/
npm run start         # Run compiled production build
npm run simulate      # Terminal chat simulator
npm run migrate       # Run database migrations
npm run seed          # Seed sample product catalog
npm run docker:up     # Start PostgreSQL + Redis containers
npm run docker:down   # Stop containers
npm test              # Run test suite
npm run test:coverage # Run tests with coverage report
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes with tests
4. Ensure all tests pass: `npm test`
5. Submit a pull request with a clear description of what changed and why

---

## License

MIT — Built in Nairobi, Kenya.
