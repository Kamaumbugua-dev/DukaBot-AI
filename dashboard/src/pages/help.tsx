import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Tab = 'help' | 'contact' | 'bug'
const TABS: { id: Tab; label: string }[] = [
  { id: 'help',    label: 'Help Centre' },
  { id: 'contact', label: 'Contact Us' },
  { id: 'bug',     label: 'Report a Bug' },
]

const FAQS = [
  {
    q: 'Why is DukaBot not responding to my customers?',
    a: 'Check Settings → Integrations. If the WhatsApp webhook shows "inactive", your Meta Business token may have expired. Re-link your WhatsApp Business Account to generate a fresh token.',
  },
  {
    q: 'A customer paid but the order still shows "pending"',
    a: 'This usually means the Daraja callback timed out. Go to Orders, find the order, and click "Check Payment Status" — this triggers a manual Daraja query. If payment is confirmed on Safaricom\'s side, the order will update immediately.',
  },
  {
    q: 'How do I change the greeting message DukaBot sends?',
    a: 'Go to Settings → AI Configuration → Greeting Message. Changes take effect immediately — no restart required.',
  },
  {
    q: 'Can I have DukaBot speak only in Swahili?',
    a: 'Yes. In Settings → AI Configuration → Agent Language, select "Swahili". DukaBot will still understand English inputs but respond in Swahili.',
  },
  {
    q: 'How do I add more products to my catalog?',
    a: 'From the dashboard go to Catalog (coming soon) or use the API: POST /api/v1/catalog with name, price, stock, and an optional image_url.',
  },
  {
    q: 'What happens if DukaBot says something wrong to a customer?',
    a: 'DukaBot uses guardrails to prevent hallucination about prices and stock — it will only quote prices that exist in your catalog. If you spot an error, contact support@dukabot.ai with the conversation ID and we\'ll investigate.',
  },
  {
    q: 'Can I export my order and customer data?',
    a: 'Yes. Go to the relevant page (Orders or Customers), click the export icon, and choose CSV. Data exports include all fields.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'Go to Settings → Subscription Plan → Manage Billing, then click "Cancel Subscription". Your access continues until the end of the billing period.',
  },
]

export function HelpPage() {
  const [tab, setTab] = useState<Tab>('help')
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [bugForm, setBugForm]         = useState({ title: '', steps: '', expected: '', actual: '' })
  const [submitted, setSubmitted]     = useState(false)

  function handleContact(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setContactForm({ name: '', email: '', message: '' })
  }

  function handleBug(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setBugForm({ title: '', steps: '', expected: '', actual: '' })
  }

  const inputClass =
    'w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30'

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Badge variant="secondary">Support</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Find answers or get in touch — we respond within 4 hours on business days.</p>
      </div>

      <div className="flex gap-2 border-b">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'help' && (
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Card key={i}>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
          <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
            Didn't find your answer?{' '}
            <button onClick={() => setTab('contact')} className="text-foreground underline underline-offset-2">
              Contact us
            </button>{' '}
            or chat on{' '}
            <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer" className="text-foreground underline underline-offset-2">
              WhatsApp
            </a>
          </div>
        </div>
      )}

      {tab === 'contact' && (
        <div className="space-y-4">
          {submitted && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              Message sent! We'll get back to you within 4 hours.
            </div>
          )}
          <form onSubmit={handleContact} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Name</label>
                <input className={inputClass} placeholder="Your name" value={contactForm.name}
                  onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email</label>
                <input className={inputClass} type="email" placeholder="you@shop.ke" value={contactForm.email}
                  onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Message</label>
              <textarea className={inputClass} rows={5} placeholder="Tell us how we can help..."
                value={contactForm.message}
                onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} required />
            </div>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Send Message
            </button>
          </form>
          <div className="border-t pt-4 text-sm text-muted-foreground space-y-1">
            <p>📧 support@dukabot.ai</p>
            <p>💬 <a href="https://wa.me/254700000000" target="_blank" rel="noreferrer" className="underline underline-offset-2">WhatsApp: +254 700 000 000</a></p>
            <p>🕐 Response time: &lt; 4 hours on weekdays, &lt; 12 hours on weekends</p>
          </div>
        </div>
      )}

      {tab === 'bug' && (
        <div className="space-y-4">
          {submitted && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              Bug report submitted! Our engineering team will investigate and follow up via email.
            </div>
          )}
          <form onSubmit={handleBug} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Bug title *</label>
              <input className={inputClass} placeholder="Short description of the issue"
                value={bugForm.title} onChange={e => setBugForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Steps to reproduce *</label>
              <textarea className={inputClass} rows={3}
                placeholder="1. Go to Orders&#10;2. Click on order ORD-001&#10;3. ..."
                value={bugForm.steps} onChange={e => setBugForm(p => ({ ...p, steps: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Expected behaviour</label>
                <textarea className={inputClass} rows={3}
                  placeholder="What should have happened"
                  value={bugForm.expected} onChange={e => setBugForm(p => ({ ...p, expected: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Actual behaviour</label>
                <textarea className={inputClass} rows={3}
                  placeholder="What actually happened"
                  value={bugForm.actual} onChange={e => setBugForm(p => ({ ...p, actual: e.target.value }))} />
              </div>
            </div>
            <button type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Submit Bug Report
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
