import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Tab = 'whatsapp' | 'mpesa' | 'analytics'

const TABS: { id: Tab; label: string }[] = [
  { id: 'whatsapp',  label: 'WhatsApp Bot' },
  { id: 'mpesa',     label: 'M-Pesa Payments' },
  { id: 'analytics', label: 'Analytics' },
]

const WHATSAPP_FEATURES = [
  { title: 'Natural Language Understanding', desc: 'Understands Kenglish, Swahili, and English seamlessly. "Niambie bei" and "what\'s the price" both work.' },
  { title: 'Product Discovery', desc: 'Customers describe what they want; DukaBot finds matching items from your catalog with photos and prices.' },
  { title: 'Shopping Cart Management', desc: 'Add, remove, and modify items mid-conversation. DukaBot tracks the cart state across the entire session.' },
  { title: 'Order Confirmation Flow', desc: 'Collects delivery address, confirms item list, and shows an order summary before triggering payment.' },
  { title: 'Automated Receipts', desc: 'Sends a formatted WhatsApp receipt with order ID once M-Pesa payment is confirmed.' },
  { title: 'Human Escalation', desc: 'DukaBot knows its limits. Complex queries or unhappy customers are flagged for your attention.' },
]

const MPESA_FEATURES = [
  { title: 'STK Push Checkout', desc: 'DukaBot triggers an M-Pesa STK Push to the customer\'s phone at order confirmation. No copy-paste of Paybill numbers.' },
  { title: 'Real-time Payment Verification', desc: 'Daraja callback is processed instantly. The order moves to "paid" status within seconds of the customer\'s PIN.' },
  { title: 'Paybill & Till Support', desc: 'Works with both Paybill (businesses) and Buy Goods / Till numbers. Set up in Settings in under 2 minutes.' },
  { title: 'Payment Timeout Handling', desc: 'If a customer doesn\'t pay within 10 minutes, DukaBot politely follows up and offers to resend the payment prompt.' },
  { title: 'Transaction Records', desc: 'Every M-Pesa transaction is logged with the Safaricom transaction code, amount, and timestamp in your Orders page.' },
  { title: 'Refund Tracking', desc: 'Mark orders for refund from the dashboard. DukaBot notifies the customer via WhatsApp with your refund instructions.' },
]

const ANALYTICS_FEATURES = [
  { title: 'Revenue Dashboard', desc: 'Daily, weekly, and monthly KES revenue charts. See your best sales periods at a glance.' },
  { title: 'Conversion Funnel', desc: 'Track how many chats turn into carts, and how many carts turn into paid orders. Find where customers drop off.' },
  { title: 'Top Products', desc: 'See which products are asked about most, added to cart most, and purchased most — separately.' },
  { title: 'Customer Segments', desc: 'New, returning, VIP, and at-risk customers are automatically segmented based on purchase history.' },
  { title: 'AI Performance Metrics', desc: 'Response time, resolution rate, and escalation rate — so you know how well DukaBot is performing.' },
  { title: 'Export & Reports', desc: 'Download any dataset as CSV. Share reports with your accountant or business partner.' },
]

const CONTENT: Record<Tab, { heading: string; sub: string; items: typeof WHATSAPP_FEATURES }> = {
  whatsapp:  { heading: 'WhatsApp Bot Features',    sub: 'Everything DukaBot does inside the chat',         items: WHATSAPP_FEATURES },
  mpesa:     { heading: 'M-Pesa Payment Features',  sub: 'Seamless Safaricom Daraja integration',           items: MPESA_FEATURES },
  analytics: { heading: 'Analytics Features',       sub: 'Data that helps you make better business decisions', items: ANALYTICS_FEATURES },
}

export function FeaturesPage() {
  const [tab, setTab] = useState<Tab>('whatsapp')
  const { heading, sub, items } = CONTENT[tab]

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Badge variant="secondary">Features</Badge>
        <h1 className="text-3xl font-bold tracking-tight">What DukaBot can do</h1>
        <p className="text-muted-foreground">A full breakdown of every capability — pick a category below.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 border-b">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold">{heading}</h2>
        <p className="text-sm text-muted-foreground mb-5">{sub}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(f => (
            <Card key={f.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{f.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
