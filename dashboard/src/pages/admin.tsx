import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'

// ── Types ────────────────────────────────────────────────────────────────────
type AdminSection =
  | 'dashboard' | 'merchants' | 'subscriptions'
  | 'payments' | 'system' | 'support' | 'settings'

// ── Mock data ─────────────────────────────────────────────────────────────────
const MERCHANTS = [
  { id: 'M001', name: 'Luthuli Electronics',   whatsapp: '+254700123456', plan: 'Growth', status: 'active',    joined: '2026-01-12', lastActive: '2 min ago',  chats: 1247, revenue: 892000  },
  { id: 'M002', name: 'Wanjiku\'s Kitchen',    whatsapp: '+254723456789', plan: 'Starter', status: 'active',   joined: '2026-02-03', lastActive: '1 hr ago',   chats: 312,  revenue: 145000  },
  { id: 'M003', name: 'Otieno Electronics',    whatsapp: '+254734567890', plan: 'Pro',    status: 'active',    joined: '2026-01-28', lastActive: '5 min ago',  chats: 3891, revenue: 2340000 },
  { id: 'M004', name: 'Njeri Fashion',         whatsapp: '+254745678901', plan: 'Growth', status: 'active',    joined: '2026-03-07', lastActive: '3 hrs ago',  chats: 678,  revenue: 310000  },
  { id: 'M005', name: 'Maina Supermarket',     whatsapp: '+254756789012', plan: 'Starter', status: 'trial',   joined: '2026-04-10', lastActive: '30 min ago', chats: 89,   revenue: 34000   },
  { id: 'M006', name: 'Akinyi Boutique',       whatsapp: '+254767890123', plan: 'Growth', status: 'active',    joined: '2026-02-19', lastActive: '2 hrs ago',  chats: 921,  revenue: 487000  },
  { id: 'M007', name: 'Kipchoge Hardware',     whatsapp: '+254778901234', plan: 'Starter', status: 'suspended', joined: '2026-03-14', lastActive: '6 days ago', chats: 44,  revenue: 18000   },
  { id: 'M008', name: 'Chebet Pharmacy',       whatsapp: '+254789012345', plan: 'Pro',    status: 'active',    joined: '2026-02-01', lastActive: '8 min ago',  chats: 2103, revenue: 1780000 },
  { id: 'M009', name: 'Ngugi Auto Parts',      whatsapp: '+254790123456', plan: 'Growth', status: 'cancelled', joined: '2026-01-05', lastActive: '12 days ago',chats: 234,  revenue: 98000   },
  { id: 'M010', name: 'Kamau Agro Supplies',   whatsapp: '+254701234567', plan: 'Growth', status: 'active',    joined: '2026-03-22', lastActive: '15 min ago', chats: 541,  revenue: 265000  },
]

const SUBSCRIPTIONS = [
  { id: 'SUB-001', merchant: 'Luthuli Electronics',  plan: 'Growth',  amount: 3999,  billing: 'Monthly', status: 'active',    method: 'M-Pesa', renewal: '2026-05-12' },
  { id: 'SUB-002', merchant: 'Wanjiku\'s Kitchen',   plan: 'Starter', amount: 999,   billing: 'Yearly',  status: 'active',    method: 'Card',   renewal: '2027-02-03' },
  { id: 'SUB-003', merchant: 'Otieno Electronics',   plan: 'Pro',     amount: 8999,  billing: 'Monthly', status: 'active',    method: 'M-Pesa', renewal: '2026-05-28' },
  { id: 'SUB-004', merchant: 'Njeri Fashion',         plan: 'Growth',  amount: 2999,  billing: 'Yearly',  status: 'active',    method: 'Card',   renewal: '2027-03-07' },
  { id: 'SUB-005', merchant: 'Maina Supermarket',    plan: 'Starter', amount: 0,     billing: 'Trial',   status: 'trial',     method: '—',      renewal: '2026-04-24' },
  { id: 'SUB-006', merchant: 'Akinyi Boutique',      plan: 'Growth',  amount: 3999,  billing: 'Monthly', status: 'active',    method: 'M-Pesa', renewal: '2026-05-19' },
  { id: 'SUB-007', merchant: 'Kipchoge Hardware',    plan: 'Starter', amount: 1499,  billing: 'Monthly', status: 'suspended', method: 'M-Pesa', renewal: '—'         },
  { id: 'SUB-008', merchant: 'Chebet Pharmacy',      plan: 'Pro',     amount: 6999,  billing: 'Yearly',  status: 'active',    method: 'Card',   renewal: '2027-02-01' },
  { id: 'SUB-009', merchant: 'Ngugi Auto Parts',     plan: 'Growth',  amount: 3999,  billing: 'Monthly', status: 'cancelled', method: 'M-Pesa', renewal: '—'         },
  { id: 'SUB-010', merchant: 'Kamau Agro Supplies',  plan: 'Growth',  amount: 2999,  billing: 'Yearly',  status: 'active',    method: 'Card',   renewal: '2027-03-22' },
]

const PAYMENTS = [
  { id: 'TXN-2890', merchant: 'Otieno Electronics',  amount: 8999,  method: 'M-Pesa', status: 'success', date: '2026-04-19 09:14', ref: 'QHJ7K2P' },
  { id: 'TXN-2889', merchant: 'Chebet Pharmacy',     amount: 6999,  method: 'Card',   status: 'success', date: '2026-04-19 08:02', ref: 'VISA4521' },
  { id: 'TXN-2888', merchant: 'Luthuli Electronics', amount: 3999,  method: 'M-Pesa', status: 'success', date: '2026-04-18 17:45', ref: 'RLM9X4K' },
  { id: 'TXN-2887', merchant: 'Akinyi Boutique',     amount: 3999,  method: 'M-Pesa', status: 'success', date: '2026-04-18 14:22', ref: 'WPQ3T8N' },
  { id: 'TXN-2886', merchant: 'Kamau Agro Supplies', amount: 2999,  method: 'Card',   status: 'success', date: '2026-04-17 11:10', ref: 'VISA9013' },
  { id: 'TXN-2885', merchant: 'Kipchoge Hardware',   amount: 1499,  method: 'M-Pesa', status: 'failed',  date: '2026-04-16 09:55', ref: 'KLP1M7X' },
  { id: 'TXN-2884', merchant: 'Njeri Fashion',       amount: 2999,  method: 'Card',   status: 'success', date: '2026-04-15 16:30', ref: 'VISA2247' },
  { id: 'TXN-2883', merchant: 'Wanjiku\'s Kitchen',  amount: 999,   method: 'Card',   status: 'success', date: '2026-04-14 10:05', ref: 'VISA6612' },
  { id: 'TXN-2882', merchant: 'Ngugi Auto Parts',    amount: 3999,  method: 'M-Pesa', status: 'refunded',date: '2026-04-12 08:30', ref: 'NPQ5J3M' },
]

const SUPPORT_TICKETS = [
  { id: 'TKT-041', merchant: 'Maina Supermarket',    subject: 'STK Push not arriving on customer phones', priority: 'high',   status: 'open',     created: '2026-04-19', assignee: 'Unassigned' },
  { id: 'TKT-040', merchant: 'Kipchoge Hardware',    subject: 'Account suspended — request review',         priority: 'high',   status: 'open',     created: '2026-04-18', assignee: 'Admin' },
  { id: 'TKT-039', merchant: 'Njeri Fashion',        subject: 'Bot responding in English despite Swahili set',priority: 'medium',status: 'open',     created: '2026-04-18', assignee: 'Admin' },
  { id: 'TKT-038', merchant: 'Wanjiku\'s Kitchen',   subject: 'How do I add product images?',               priority: 'low',    status: 'resolved', created: '2026-04-17', assignee: 'Admin' },
  { id: 'TKT-037', merchant: 'Kamau Agro Supplies',  subject: 'Want to upgrade from Growth to Pro',          priority: 'medium', status: 'resolved', created: '2026-04-16', assignee: 'Admin' },
  { id: 'TKT-036', merchant: 'Otieno Electronics',   subject: 'Need API access for custom integration',      priority: 'medium', status: 'resolved', created: '2026-04-15', assignee: 'Admin' },
]

const SERVICES = [
  { name: 'WhatsApp Cloud API',   status: 'operational', latency: '112ms', uptime: '99.98%', region: 'Meta Edge'      },
  { name: 'M-Pesa Daraja API',    status: 'operational', latency: '340ms', uptime: '99.71%', region: 'Safaricom KE'   },
  { name: 'Claude AI (Sonnet)',    status: 'operational', latency: '890ms', uptime: '99.95%', region: 'Anthropic US'   },
  { name: 'PostgreSQL (Railway)', status: 'operational', latency: '18ms',  uptime: '99.99%', region: 'Railway EU-W'   },
  { name: 'Redis Cache',          status: 'operational', latency: '4ms',   uptime: '99.99%', region: 'Railway EU-W'   },
  { name: 'Webhook Receiver',     status: 'operational', latency: '62ms',  uptime: '100%',   region: 'Cloudflare KE'  },
  { name: 'Dashboard CDN',        status: 'degraded',    latency: '890ms', uptime: '98.40%', region: 'Cloudflare'     },
  { name: 'Email (Resend)',        status: 'operational', latency: '220ms', uptime: '99.88%', region: 'Resend EU'      },
]

// ── Stat card ────────────────────────────────────────────────────────────────
function KPI({ label, value, sub, color = 'indigo' }: {
  label: string; value: string; sub: string; color?: string
}) {
  const colors: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-700',
    green:  'from-green-500 to-green-700',
    purple: 'from-purple-500 to-purple-700',
    orange: 'from-orange-500 to-orange-600',
    blue:   'from-blue-500 to-blue-700',
    red:    'from-red-500 to-red-600',
  }
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
      <div className={`inline-flex px-2.5 py-1 rounded-lg bg-gradient-to-r ${colors[color]} mb-3`}>
        <span className="text-white text-xs font-semibold">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
    </div>
  )
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    trial:       'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    suspended:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    cancelled:   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    operational: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    degraded:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500',
    down:        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    success:     'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    failed:      'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    refunded:    'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    open:        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500',
    resolved:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    high:        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    medium:      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500',
    low:         'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV: { section: AdminSection; label: string; icon: React.ReactNode; badge?: string }[] = [
  {
    section: 'dashboard', label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg>,
  },
  {
    section: 'merchants', label: 'Merchants',
    badge: `${MERCHANTS.length}`,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  },
  {
    section: 'subscriptions', label: 'Subscriptions',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/></svg>,
  },
  {
    section: 'payments', label: 'Payments',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    section: 'system', label: 'System Health',
    badge: SERVICES.some(s => s.status !== 'operational') ? '!' : undefined,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    section: 'support', label: 'Support Tickets',
    badge: `${SUPPORT_TICKETS.filter(t => t.status === 'open').length}`,
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  },
  {
    section: 'settings', label: 'Platform Settings',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg>,
  },
]

// ── SECTIONS ──────────────────────────────────────────────────────────────────

function Dashboard() {
  const mrr = SUBSCRIPTIONS.filter(s => s.status === 'active' && s.billing === 'Monthly').reduce((a, s) => a + s.amount, 0)
    + SUBSCRIPTIONS.filter(s => s.status === 'active' && s.billing === 'Yearly').reduce((a, s) => a + Math.round(s.amount / 12), 0)

  const totalRevenue = PAYMENTS.filter(p => p.status === 'success').reduce((a, p) => a + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">DukaBot AI — admin view · {new Date().toLocaleDateString('en-KE', { dateStyle: 'long' })}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KPI label="Total Merchants"     value={`${MERCHANTS.length}`}                                          sub={`${MERCHANTS.filter(m=>m.status==='active').length} active · ${MERCHANTS.filter(m=>m.status==='trial').length} trial`} color="indigo" />
        <KPI label="Monthly Recurring Revenue" value={`KES ${mrr.toLocaleString()}`}                           sub="Normalised across all billing cycles"           color="green"  />
        <KPI label="Total Revenue"       value={`KES ${totalRevenue.toLocaleString()}`}                         sub="All successful transactions"                   color="purple" />
        <KPI label="Total Chats"         value={MERCHANTS.reduce((a,m)=>a+m.chats,0).toLocaleString()}          sub="Across all merchants this month"               color="blue"   />
        <KPI label="Open Tickets"        value={`${SUPPORT_TICKETS.filter(t=>t.status==='open').length}`}       sub={`${SUPPORT_TICKETS.filter(t=>t.status==='resolved').length} resolved`} color="orange" />
        <KPI label="System Status"       value={SERVICES.every(s=>s.status==='operational') ? 'All OK' : 'Degraded'} sub={`${SERVICES.filter(s=>s.status==='operational').length}/${SERVICES.length} services operational`} color={SERVICES.every(s=>s.status==='operational') ? 'green' : 'red'} />
      </div>

      {/* Plan distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan Distribution</CardTitle>
            <CardDescription>Active subscriptions by plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {['Starter', 'Growth', 'Pro'].map(plan => {
              const count = SUBSCRIPTIONS.filter(s => s.plan === plan && s.status === 'active').length
              const total = SUBSCRIPTIONS.filter(s => s.status === 'active').length
              const pct   = total ? Math.round((count / total) * 100) : 0
              const colors: Record<string, string> = { Starter: 'bg-blue-500', Growth: 'bg-indigo-600', Pro: 'bg-purple-600' }
              return (
                <div key={plan}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{plan}</span>
                    <span className="text-gray-500">{count} merchants · {pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${colors[plan]}`}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Signups</CardTitle>
            <CardDescription>Last 5 merchants to join</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-gray-50 dark:divide-gray-800">
            {[...MERCHANTS].sort((a,b) => b.joined.localeCompare(a.joined)).slice(0,5).map(m => (
              <div key={m.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {m.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.joined}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{m.plan}</Badge>
                  <StatusBadge status={m.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue by payment method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <CardDescription>Last 5 payments across all merchants</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENTS.slice(0,5).map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="text-sm font-medium">{p.merchant}</TableCell>
                  <TableCell className="text-sm">KES {p.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.method === 'M-Pesa' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                      {p.method}
                    </span>
                  </TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-xs text-gray-500">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function MerchantsSection() {
  const [search, setSearch] = useState('')
  const [actions, setActions] = useState<Record<string, string>>({})
  const filtered = MERCHANTS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.whatsapp.includes(search)
  )
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Merchants</h2>
          <p className="text-sm text-gray-500 mt-0.5">{MERCHANTS.length} total · {MERCHANTS.filter(m=>m.status==='active').length} active</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or number…"
          className="w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all" />
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Chats</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(m => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shrink-0">{m.name[0]}</div>
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-gray-500">{m.whatsapp}</TableCell>
                  <TableCell><Badge variant="outline">{m.plan}</Badge></TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
                  <TableCell className="text-sm">{m.chats.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">KES {m.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-gray-500">{m.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {actions[m.id] ? (
                        <span className="text-xs text-green-600 font-medium">{actions[m.id]}</span>
                      ) : (
                        <>
                          <button onClick={() => setActions(a=>({...a,[m.id]:'Viewed'}))}
                            className="px-2 py-1 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all">
                            View
                          </button>
                          {m.status === 'active' && (
                            <button onClick={() => setActions(a=>({...a,[m.id]:'Suspended'}))}
                              className="px-2 py-1 text-xs rounded-lg bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-100 transition-all">
                              Suspend
                            </button>
                          )}
                          {m.status === 'suspended' && (
                            <button onClick={() => setActions(a=>({...a,[m.id]:'Reinstated'}))}
                              className="px-2 py-1 text-xs rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 hover:bg-green-100 transition-all">
                              Reinstate
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function SubscriptionsSection() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Subscriptions</h2>
        <p className="text-sm text-gray-500 mt-0.5">{SUBSCRIPTIONS.filter(s=>s.status==='active').length} active · KES {SUBSCRIPTIONS.filter(s=>s.status==='active').reduce((a,s)=>a+s.amount,0).toLocaleString()} this cycle</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Active',    value: SUBSCRIPTIONS.filter(s=>s.status==='active').length,    color: 'text-green-600'  },
          { label: 'Trial',     value: SUBSCRIPTIONS.filter(s=>s.status==='trial').length,     color: 'text-blue-600'   },
          { label: 'Suspended', value: SUBSCRIPTIONS.filter(s=>s.status==='suspended').length, color: 'text-red-600'    },
          { label: 'Cancelled', value: SUBSCRIPTIONS.filter(s=>s.status==='cancelled').length, color: 'text-gray-500'   },
        ].map(({label,value,color}) => (
          <div key={label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Billing</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Renewal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUBSCRIPTIONS.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs text-gray-500">{s.id}</TableCell>
                  <TableCell className="text-sm font-medium">{s.merchant}</TableCell>
                  <TableCell><Badge variant="outline">{s.plan}</Badge></TableCell>
                  <TableCell className="text-sm">{s.amount > 0 ? `KES ${s.amount.toLocaleString()}` : '—'}</TableCell>
                  <TableCell className="text-xs text-gray-500">{s.billing}</TableCell>
                  <TableCell>
                    {s.method !== '—' && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.method === 'M-Pesa' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                        {s.method}
                      </span>
                    )}
                    {s.method === '—' && <span className="text-gray-400 text-xs">—</span>}
                  </TableCell>
                  <TableCell><StatusBadge status={s.status} /></TableCell>
                  <TableCell className="text-xs text-gray-500">{s.renewal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentsSection() {
  const success  = PAYMENTS.filter(p=>p.status==='success').reduce((a,p)=>a+p.amount,0)
  const mpesa    = PAYMENTS.filter(p=>p.method==='M-Pesa'&&p.status==='success').reduce((a,p)=>a+p.amount,0)
  const card     = PAYMENTS.filter(p=>p.method==='Card'&&p.status==='success').reduce((a,p)=>a+p.amount,0)
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payments</h2>
        <p className="text-sm text-gray-500 mt-0.5">All subscription transactions</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total Collected</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">KES {success.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <p className="text-xs text-green-600 font-medium">M-Pesa</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">KES {mpesa.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <p className="text-xs text-blue-600 font-medium">Card (Visa)</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">KES {card.toLocaleString()}</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENTS.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="text-sm font-medium">{p.merchant}</TableCell>
                  <TableCell className="text-sm font-medium">KES {p.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.method === 'M-Pesa' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                      {p.method}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{p.ref}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-xs text-gray-500">{p.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function SystemHealth() {
  const allOk = SERVICES.every(s => s.status === 'operational')
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">System Health</h2>
          <p className="text-sm text-gray-500 mt-0.5">Real-time status of all platform dependencies</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${allOk ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500'}`}>
          <span className={`w-2 h-2 rounded-full ${allOk ? 'bg-green-500 animate-pulse' : 'bg-yellow-500 animate-pulse'}`} />
          {allOk ? 'All Systems Operational' : 'Partial Degradation'}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SERVICES.map(s => (
          <div key={s.name} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                s.status === 'operational' ? 'bg-green-500' :
                s.status === 'degraded'    ? 'bg-yellow-500 animate-pulse' : 'bg-red-500 animate-pulse'
              }`} />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.name}</p>
                <p className="text-xs text-gray-400">{s.region}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{s.latency}</p>
              <p className="text-xs text-gray-400">{s.uptime} uptime</p>
            </div>
          </div>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-sm">Incident Log</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">Dashboard CDN latency degraded</p>
              <p className="text-xs text-gray-500">2026-04-19 07:12 UTC · Cloudflare investigating · No merchant impact</p>
            </div>
          </div>
          <Separator />
          <div className="flex gap-3 items-start">
            <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">M-Pesa Daraja maintenance resolved</p>
              <p className="text-xs text-gray-500">2026-04-17 02:00–04:30 UTC · Safaricom scheduled window · Resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SupportSection() {
  const [tickets, setTickets] = useState(SUPPORT_TICKETS)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Support Tickets</h2>
          <p className="text-sm text-gray-500 mt-0.5">{tickets.filter(t=>t.status==='open').length} open · {tickets.filter(t=>t.status==='resolved').length} resolved</p>
        </div>
      </div>
      <div className="space-y-3">
        {tickets.map(t => (
          <div key={t.id} className={`bg-white dark:bg-gray-900 border rounded-xl p-4 ${t.status === 'open' ? 'border-yellow-200 dark:border-yellow-900/50' : 'border-gray-100 dark:border-gray-800'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs text-gray-400">{t.id}</span>
                  <StatusBadge status={t.priority} />
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.subject}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.merchant} · {t.created} · Assignee: {t.assignee}</p>
              </div>
              {t.status === 'open' && (
                <button
                  onClick={() => setTickets(prev => prev.map(tk => tk.id === t.id ? {...tk, status: 'resolved', assignee: 'Admin'} : tk))}
                  className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 hover:bg-green-100 transition-all"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlatformSettings() {
  const [saved, setSaved] = useState(false)
  const [rates, setRates] = useState({ starter: '1499', growth: '3999', pro: '8999' })
  const [limits, setLimits] = useState({ starterChats: '200', growthChats: '1000', trialDays: '14' })

  function handleSave() {
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Global configuration for DukaBot AI</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Subscription Pricing (KES/month)</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[['Starter', 'starter'], ['Growth', 'growth'], ['Pro', 'pro']].map(([label, key]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              <input value={rates[key as keyof typeof rates]}
                onChange={e => setRates(r => ({...r, [key]: e.target.value}))}
                className="w-32 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-right outline-none focus:ring-2 focus:ring-indigo-400/40 bg-white dark:bg-gray-900"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Plan Limits</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[['Starter — Max chats/month', 'starterChats'], ['Growth — Max chats/month', 'growthChats'], ['Trial period (days)', 'trialDays']].map(([label, key]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
              <input value={limits[key as keyof typeof limits]}
                onChange={e => setLimits(l => ({...l, [key]: e.target.value}))}
                className="w-32 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm text-right outline-none focus:ring-2 focus:ring-indigo-400/40 bg-white dark:bg-gray-900"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">API Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[
            ['Claude Model',         'claude-sonnet-4-6'],
            ['Max tool calls/req',   '10'],
            ['Agent timeout (sec)',  '30'],
            ['Webhook secret',       '••••••••••••••••'],
          ].map(([label, val]) => (
            <div key={label} className="flex items-center justify-between py-1 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
              <span className="text-sm font-mono font-medium text-gray-800 dark:text-gray-200">{val}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <button onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all active:scale-[0.97]">
          Save Changes
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Saved</span>}
      </div>
    </div>
  )
}

// ── MAIN ADMIN LAYOUT ─────────────────────────────────────────────────────────
interface AdminProps {
  onSignOut: () => void
}

export function AdminPage({ onSignOut }: AdminProps) {
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const SECTION_MAP: Record<AdminSection, React.ReactNode> = {
    dashboard:     <Dashboard />,
    merchants:     <MerchantsSection />,
    subscriptions: <SubscriptionsSection />,
    payments:      <PaymentsSection />,
    system:        <SystemHealth />,
    support:       <SupportSection />,
    settings:      <PlatformSettings />,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} shrink-0 flex flex-col bg-gray-900 dark:bg-gray-950 border-r border-gray-800 transition-all duration-300`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-gray-800">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="3" height="12" rx="1.5" fill="white"/>
              <rect x="6.5" y="2" width="3" height="8" rx="1.5" fill="white"/>
              <rect x="11" y="2" width="3" height="10" rx="1.5" fill="white"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white leading-none">DukaBot AI</p>
              <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest mt-0.5">Admin Panel</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(v=>!v)} className="ml-auto text-gray-500 hover:text-gray-300 transition-colors shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d={sidebarOpen ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <div className="space-y-0.5 px-2">
            {NAV.map(({ section: sec, label, icon, badge }) => (
              <button key={sec} onClick={() => setSection(sec)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  section === sec
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}>
                <span className="shrink-0">{icon}</span>
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{label}</span>
                    {badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        section === sec ? 'bg-white/20 text-white' : badge === '!' ? 'bg-yellow-500 text-white' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Admin user */}
        <div className="border-t border-gray-800 p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-700 flex items-center justify-center text-white text-xs font-bold">A</div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">admin@dukabot.ai</p>
                <button onClick={onSignOut} className="text-[10px] text-gray-500 hover:text-red-400 transition-colors">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">
            {NAV.find(n => n.section === section)?.label}
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
            <span className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div key={section}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {SECTION_MAP[section]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
