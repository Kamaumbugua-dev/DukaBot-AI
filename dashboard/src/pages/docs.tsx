import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type Tab = 'docs' | 'api' | 'status'
const TABS: { id: Tab; label: string }[] = [
  { id: 'docs',   label: 'Documentation' },
  { id: 'api',    label: 'API Reference' },
  { id: 'status', label: 'Status' },
]

const DOC_SECTIONS = [
  {
    title: 'Getting Started',
    items: ['Quickstart guide', 'Connect WhatsApp Business API', 'Upload your first catalog', 'Configure M-Pesa Daraja', 'Test your first customer chat'],
  },
  {
    title: 'Merchant Dashboard',
    items: ['Overview metrics explained', 'Managing orders', 'Customer segments', 'Analytics deep dive', 'Settings & integrations'],
  },
  {
    title: 'AI Customisation',
    items: ['Changing DukaBot\'s greeting', 'Setting language preference (English / Swahili / Kenglish)', 'Custom escalation rules', 'Guardrails & prompt safety', 'Training on your product descriptions'],
  },
  {
    title: 'Payments',
    items: ['M-Pesa STK Push flow', 'Handling failed payments', 'Refund process', 'Transaction reconciliation', 'Paybill vs Till configuration'],
  },
]

const API_ENDPOINTS = [
  { method: 'GET',    path: '/api/v1/merchants/me',         desc: 'Returns the authenticated merchant profile and plan details.' },
  { method: 'GET',    path: '/api/v1/orders',               desc: 'List all orders. Supports ?status=paid|pending|shipped.' },
  { method: 'POST',   path: '/api/v1/orders',               desc: 'Create a manual order (bypass WhatsApp flow).' },
  { method: 'GET',    path: '/api/v1/customers',             desc: 'List customers with pagination and segment filters.' },
  { method: 'GET',    path: '/api/v1/catalog',               desc: 'Retrieve the full product catalog.' },
  { method: 'POST',   path: '/api/v1/catalog',               desc: 'Add a new product. Accepts name, price, stock, image_url.' },
  { method: 'DELETE', path: '/api/v1/catalog/:id',           desc: 'Remove a product from the catalog.' },
  { method: 'POST',   path: '/api/v1/whatsapp/send',         desc: 'Send a WhatsApp message to a customer phone number.' },
  { method: 'GET',    path: '/api/v1/analytics/revenue',     desc: 'Revenue breakdown by day/week/month.' },
  { method: 'POST',   path: '/api/v1/mpesa/stk-push',        desc: 'Manually trigger an M-Pesa STK Push to a phone number.' },
]

const METHOD_COLOR: Record<string, string> = {
  GET:    'bg-blue-100 text-blue-700',
  POST:   'bg-green-100 text-green-700',
  DELETE: 'bg-red-100 text-red-700',
  PATCH:  'bg-yellow-100 text-yellow-700',
}

const STATUS_SERVICES = [
  { name: 'WhatsApp Cloud API',  status: 'Operational',   uptime: '99.97%' },
  { name: 'M-Pesa Daraja',       status: 'Operational',   uptime: '99.91%' },
  { name: 'Claude AI (Anthropic)',status: 'Operational',  uptime: '99.99%' },
  { name: 'Dashboard API',       status: 'Operational',   uptime: '100%' },
  { name: 'PostgreSQL Database', status: 'Operational',   uptime: '99.99%' },
  { name: 'Redis Cache',         status: 'Operational',   uptime: '100%' },
  { name: 'File Storage',        status: 'Operational',   uptime: '99.98%' },
]

export function DocsPage() {
  const [tab, setTab] = useState<Tab>('docs')

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Badge variant="secondary">Resources</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">Everything you need to get the most out of DukaBot AI.</p>
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

      {tab === 'docs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DOC_SECTIONS.map(s => (
            <Card key={s.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5">›</span>
                      <span className="hover:text-foreground cursor-pointer transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'api' && (
        <div className="space-y-3">
          <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-mono text-xs">Base URL:</span>{' '}
            <span className="font-mono text-xs font-semibold text-foreground">https://api.dukabot.ai/v1</span>
            <span className="ml-4 text-xs">· Auth: Bearer token in <span className="font-mono">Authorization</span> header</span>
          </div>
          <div className="space-y-2">
            {API_ENDPOINTS.map(ep => (
              <Card key={ep.path}>
                <CardContent className="pt-3 pb-3 flex items-start gap-3">
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold font-mono ${METHOD_COLOR[ep.method]}`}>
                    {ep.method}
                  </span>
                  <div>
                    <p className="text-xs font-mono font-semibold text-foreground">{ep.path}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ep.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tab === 'status' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-700">All systems operational</span>
          </div>
          <div className="space-y-2">
            {STATUS_SERVICES.map(svc => (
              <Card key={svc.name}>
                <CardContent className="pt-3 pb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">{svc.name}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{svc.uptime} uptime</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-xs text-green-700 font-medium">{svc.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Last checked: just now · Incident history available on request</p>
        </div>
      )}
    </div>
  )
}
