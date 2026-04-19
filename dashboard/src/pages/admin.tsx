import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// ── Types ────────────────────────────────────────────────────────────────────
type AdminSection =
  | 'dashboard' | 'merchants' | 'subscriptions'
  | 'payments' | 'system' | 'support' | 'settings' | 'history'
  | 'analytics' | 'pnl'

type ActivityKind = 'signup' | 'payment' | 'plan_change' | 'suspension' | 'reinstatement' | 'cancellation' | 'ticket' | 'chat_milestone' | 'refund'

interface ActivityEvent {
  date: string
  kind: ActivityKind
  title: string
  detail: string
}

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
  { id: 'SUB-007', merchant: 'Kipchoge Hardware',    plan: 'Starter', amount: 1499,  billing: 'Monthly', status: 'suspended', method: 'M-Pesa', renewal: '—', suspensionReason: 'Payment failure — M-Pesa STK Push declined 3 consecutive times on 2026-04-16. Account auto-suspended after 24-hour grace period.', reinstateRecommendation: 'REINSTATE', reinstateNote: 'Merchant has an open support ticket (#TKT-040) requesting review. First-time payment failure. Good chat activity (44 chats). Recommend reinstating with a 72-hour payment retry window.' },
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

const MERCHANT_ACTIVITY: Record<string, ActivityEvent[]> = {
  M001: [
    { date: '2026-01-12 09:04', kind: 'signup',         title: 'Account created',                   detail: 'Registered on Starter trial — via web portal' },
    { date: '2026-01-12 09:18', kind: 'payment',        title: 'First payment — KES 3,999',          detail: 'Upgraded to Growth Monthly · M-Pesa · Ref: RLM9X4K' },
    { date: '2026-01-12 09:19', kind: 'plan_change',    title: 'Plan: Starter → Growth',             detail: 'Upgraded immediately after signup' },
    { date: '2026-02-01 14:30', kind: 'chat_milestone', title: '500 chats milestone reached',         detail: 'Bot handled 500 customer conversations' },
    { date: '2026-02-12 09:04', kind: 'payment',        title: 'Renewal — KES 3,999',                detail: 'Growth Monthly auto-renewed · M-Pesa · Ref: ZKX2P7Q' },
    { date: '2026-03-12 09:04', kind: 'payment',        title: 'Renewal — KES 3,999',                detail: 'Growth Monthly auto-renewed · M-Pesa · Ref: PNW5J3R' },
    { date: '2026-03-28 11:00', kind: 'chat_milestone', title: '1,000 chats milestone reached',       detail: 'Bot handled 1,000 customer conversations total' },
    { date: '2026-04-12 09:14', kind: 'payment',        title: 'Renewal — KES 3,999',                detail: 'Growth Monthly auto-renewed · M-Pesa · Ref: RLM9X4K' },
  ],
  M002: [
    { date: '2026-02-03 11:22', kind: 'signup',         title: 'Account created',                   detail: 'Registered on Starter trial — via referral link' },
    { date: '2026-02-03 11:45', kind: 'payment',        title: 'First payment — KES 999',            detail: 'Starter Yearly · Card · Ref: VISA6612' },
    { date: '2026-02-03 11:46', kind: 'plan_change',    title: 'Plan: Trial → Starter (Yearly)',     detail: 'Chose yearly billing for 20% discount' },
    { date: '2026-04-14 10:05', kind: 'payment',        title: 'Yearly renewal — KES 999',           detail: 'Starter Yearly auto-renewed · Card · Ref: VISA6612' },
    { date: '2026-04-17 14:20', kind: 'ticket',         title: 'Support ticket #TKT-038 resolved',   detail: 'Query: How to add product images — answered by Admin' },
  ],
  M003: [
    { date: '2026-01-28 08:00', kind: 'signup',         title: 'Account created',                   detail: 'Direct Pro signup — referred by partner agency' },
    { date: '2026-01-28 08:12', kind: 'payment',        title: 'First payment — KES 8,999',          detail: 'Pro Monthly · M-Pesa · Ref: QHJ7K2P' },
    { date: '2026-01-28 08:13', kind: 'plan_change',    title: 'Plan: Trial → Pro',                  detail: 'Immediate activation of Pro features' },
    { date: '2026-02-14 16:00', kind: 'chat_milestone', title: '1,000 chats milestone reached',       detail: 'Fastest merchant to reach 1K chats — 17 days' },
    { date: '2026-02-28 08:00', kind: 'payment',        title: 'Renewal — KES 8,999',                detail: 'Pro Monthly auto-renewed · M-Pesa · Ref: LRT4N9X' },
    { date: '2026-03-28 08:00', kind: 'payment',        title: 'Renewal — KES 8,999',                detail: 'Pro Monthly auto-renewed · M-Pesa · Ref: VBQ8K1J' },
    { date: '2026-04-04 09:30', kind: 'ticket',         title: 'Support ticket #TKT-036 resolved',   detail: 'API access for custom ERP integration — granted' },
    { date: '2026-04-19 09:14', kind: 'payment',        title: 'Renewal — KES 8,999',                detail: 'Pro Monthly auto-renewed · M-Pesa · Ref: QHJ7K2P' },
  ],
  M004: [
    { date: '2026-03-07 10:00', kind: 'signup',         title: 'Account created',                   detail: 'Started 14-day trial' },
    { date: '2026-03-07 10:35', kind: 'payment',        title: 'First payment — KES 2,999',          detail: 'Growth Yearly · Card · Ref: VISA2247' },
    { date: '2026-03-07 10:36', kind: 'plan_change',    title: 'Plan: Trial → Growth (Yearly)',      detail: 'Opted for yearly billing' },
    { date: '2026-04-15 16:30', kind: 'payment',        title: 'Yearly renewal — KES 2,999',         detail: 'Growth Yearly auto-renewed · Card · Ref: VISA2247' },
    { date: '2026-04-18 08:00', kind: 'ticket',         title: 'Support ticket #TKT-039 opened',     detail: 'Bot replying in English despite Swahili set — investigating' },
  ],
  M005: [
    { date: '2026-04-10 13:00', kind: 'signup',         title: 'Account created',                   detail: 'Started 14-day free trial' },
    { date: '2026-04-19 10:00', kind: 'ticket',         title: 'Support ticket #TKT-041 opened',     detail: 'STK Push not arriving on customer phones — high priority' },
  ],
  M006: [
    { date: '2026-02-19 09:30', kind: 'signup',         title: 'Account created',                   detail: 'Registered via WhatsApp referral' },
    { date: '2026-02-19 09:50', kind: 'payment',        title: 'First payment — KES 3,999',          detail: 'Growth Monthly · M-Pesa · Ref: WPQ3T8N' },
    { date: '2026-02-19 09:51', kind: 'plan_change',    title: 'Plan: Trial → Growth',               detail: 'Activated Growth features immediately' },
    { date: '2026-03-19 09:30', kind: 'payment',        title: 'Renewal — KES 3,999',                detail: 'Growth Monthly auto-renewed · M-Pesa · Ref: AXP2Q8Z' },
    { date: '2026-04-18 14:22', kind: 'payment',        title: 'Renewal — KES 3,999',                detail: 'Growth Monthly auto-renewed · M-Pesa · Ref: WPQ3T8N' },
  ],
  M007: [
    { date: '2026-03-14 11:00', kind: 'signup',         title: 'Account created',                   detail: 'Started 14-day free trial' },
    { date: '2026-03-14 11:20', kind: 'payment',        title: 'First payment — KES 1,499',          detail: 'Starter Monthly · M-Pesa · Ref: KLP1M7X' },
    { date: '2026-03-14 11:21', kind: 'plan_change',    title: 'Plan: Trial → Starter',              detail: 'Activated Starter plan' },
    { date: '2026-04-16 09:55', kind: 'payment',        title: 'Renewal failed — KES 1,499',         detail: 'M-Pesa STK Push declined · Ref: KLP1M7X · 3 retries' },
    { date: '2026-04-16 10:05', kind: 'suspension',     title: 'Account suspended',                  detail: 'Auto-suspended after payment failure · Grace period expired' },
    { date: '2026-04-18 08:00', kind: 'ticket',         title: 'Support ticket #TKT-040 opened',     detail: 'Merchant requesting account review and reinstatement' },
  ],
  M008: [
    { date: '2026-02-01 07:00', kind: 'signup',         title: 'Account created',                   detail: 'Pro plan — direct enterprise onboarding' },
    { date: '2026-02-01 07:15', kind: 'payment',        title: 'First payment — KES 6,999',          detail: 'Pro Yearly · Card · Ref: VISA4521' },
    { date: '2026-02-01 07:16', kind: 'plan_change',    title: 'Plan: Trial → Pro (Yearly)',         detail: 'Enterprise yearly billing activated' },
    { date: '2026-03-01 09:00', kind: 'chat_milestone', title: '1,000 chats milestone reached',       detail: 'Consistent high-volume pharmacy queries' },
    { date: '2026-04-01 09:00', kind: 'chat_milestone', title: '2,000 chats milestone reached',       detail: 'Second month doubles volume' },
    { date: '2026-04-19 08:02', kind: 'payment',        title: 'Yearly renewal — KES 6,999',         detail: 'Pro Yearly auto-renewed · Card · Ref: VISA4521' },
  ],
  M009: [
    { date: '2026-01-05 14:00', kind: 'signup',         title: 'Account created',                   detail: 'Started on Growth Monthly' },
    { date: '2026-01-05 14:20', kind: 'payment',        title: 'First payment — KES 3,999',          detail: 'Growth Monthly · M-Pesa · Ref: NPQ5J3M' },
    { date: '2026-01-05 14:21', kind: 'plan_change',    title: 'Plan: Trial → Growth',               detail: 'Growth activated' },
    { date: '2026-02-05 14:00', kind: 'payment',        title: 'Renewal — KES 3,999',                detail: 'Growth Monthly renewed · M-Pesa · Ref: XKT7B2P' },
    { date: '2026-03-05 14:00', kind: 'payment',        title: 'Renewal — KES 3,999',                detail: 'Growth Monthly renewed · M-Pesa · Ref: QMJ4C1L' },
    { date: '2026-04-05 08:00', kind: 'cancellation',   title: 'Subscription cancelled',             detail: 'Merchant opted out — cited low chat volume in sector' },
    { date: '2026-04-12 08:30', kind: 'refund',         title: 'Refund issued — KES 3,999',          detail: 'April payment refunded per dispute · Ref: NPQ5J3M' },
  ],
  M010: [
    { date: '2026-03-22 10:00', kind: 'signup',         title: 'Account created',                   detail: 'Growth Yearly — seasonal agri-business' },
    { date: '2026-03-22 10:20', kind: 'payment',        title: 'First payment — KES 2,999',          detail: 'Growth Yearly · Card · Ref: VISA9013' },
    { date: '2026-03-22 10:21', kind: 'plan_change',    title: 'Plan: Trial → Growth (Yearly)',      detail: 'Yearly billing chosen' },
    { date: '2026-04-17 11:10', kind: 'payment',        title: 'Renewal — KES 2,999',                detail: 'Growth Yearly auto-renewed · Card · Ref: VISA9013' },
    { date: '2026-04-16 13:00', kind: 'ticket',         title: 'Support ticket #TKT-037 resolved',   detail: 'Upgrade inquiry Growth → Pro — Admin guided merchant' },
  ],
}

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
    section: 'analytics', label: 'Analytics',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M7 16l4-4 4 4 4-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    section: 'pnl', label: 'P&L Account',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    section: 'history', label: 'Merchant History',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
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

function MerchantsSection({ onViewHistory }: { onViewHistory: (id: string) => void }) {
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
                          <button onClick={() => onViewHistory(m.id)}
                            className="px-2 py-1 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-all">
                            History
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
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(SUBSCRIPTIONS.map(s => [s.id, s.status]))
  )
  const [expandedSuspended, setExpandedSuspended] = useState<string | null>(null)

  const suspended = SUBSCRIPTIONS.filter(s => s.status === 'suspended')

  function reinstate(id: string) {
    setStatuses(prev => ({ ...prev, [id]: 'active' }))
    setExpandedSuspended(null)
  }

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

      {/* Suspended accounts requiring action */}
      {suspended.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">Suspended Accounts — Action Required</p>
          </div>
          {suspended.map(s => {
            const isExpanded = expandedSuspended === s.id
            const isReinstated = statuses[s.id] === 'active'
            const sub = s as typeof s & { suspensionReason?: string; reinstateRecommendation?: string; reinstateNote?: string }
            return (
              <div key={s.id} className={`border rounded-xl transition-all ${isReinstated ? 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20' : 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20'}`}>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{s.merchant}</p>
                        <Badge variant="outline">{s.plan}</Badge>
                        {isReinstated
                          ? <StatusBadge status="active" />
                          : <StatusBadge status="suspended" />
                        }
                      </div>
                      <p className="text-xs text-gray-500 font-mono">{s.id} · {s.billing} · KES {s.amount.toLocaleString()}/cycle</p>
                    </div>
                    {!isReinstated && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setExpandedSuspended(isExpanded ? null : s.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 transition-all">
                          {isExpanded ? 'Hide Details' : 'View Reason'}
                        </button>
                        <button onClick={() => reinstate(s.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all">
                          Reinstate Account
                        </button>
                      </div>
                    )}
                    {isReinstated && (
                      <span className="text-xs text-green-600 font-semibold px-3 py-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">✓ Reinstated</span>
                    )}
                  </div>

                  {isExpanded && !isReinstated && sub.suspensionReason && (
                    <div className="mt-4 space-y-3 border-t border-red-100 dark:border-red-900/40 pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-1">Suspension Reason</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{sub.suspensionReason}</p>
                      </div>
                      {sub.reinstateNote && (
                        <div className={`rounded-lg p-3 ${sub.reinstateRecommendation === 'REINSTATE' ? 'bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900' : 'bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${sub.reinstateRecommendation === 'REINSTATE' ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                              Recommendation: {sub.reinstateRecommendation}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{sub.reinstateNote}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle className="text-sm">All Subscriptions</CardTitle></CardHeader>
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
                  <TableCell><StatusBadge status={statuses[s.id] ?? s.status} /></TableCell>
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

// ── History Section ───────────────────────────────────────────────────────────
const KIND_META: Record<ActivityKind, { label: string; dot: string; icon: React.ReactNode }> = {
  signup:         { label: 'Signup',         dot: 'bg-indigo-500',  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2.5"/></svg> },
  payment:        { label: 'Payment',        dot: 'bg-green-500',   icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> },
  plan_change:    { label: 'Plan Change',    dot: 'bg-purple-500',  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg> },
  suspension:     { label: 'Suspension',     dot: 'bg-red-500',     icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5"/><path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> },
  reinstatement:  { label: 'Reinstatement',  dot: 'bg-teal-500',    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/></svg> },
  cancellation:   { label: 'Cancellation',   dot: 'bg-gray-500',    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> },
  ticket:         { label: 'Support Ticket', dot: 'bg-yellow-500',  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinejoin="round"/></svg> },
  chat_milestone: { label: 'Chat Milestone', dot: 'bg-blue-500',    icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M22 4L12 14.01l-3-3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  refund:         { label: 'Refund',         dot: 'bg-orange-500',  icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M3 9l4-4 4 4M7 5v14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 15l-4 4-4-4M17 19V5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
}

type HistoryTab = 'timeline' | 'payments' | 'tickets' | 'badges'

// ── Merchant badges lookup ────────────────────────────────────────────────────
const MERCHANT_BADGES: Record<string, { name: string; tier: string; earned: boolean; benefit: string }[]> = {
  M001: [
    { name: 'Chat Master',     tier: 'Gold',    earned: true,  benefit: 'Priority support queue + 8% loyalty discount' },
    { name: 'Revenue Rookie',  tier: 'Silver',  earned: true,  benefit: 'Advanced revenue analytics unlocked' },
    { name: 'Loyal Merchant',  tier: 'Silver',  earned: true,  benefit: 'Free catalog tier upgrade for one month' },
    { name: 'M-Pesa Champion', tier: 'Silver',  earned: true,  benefit: 'Payment priority routing enabled' },
    { name: 'Chat Legend',     tier: 'Diamond', earned: false, benefit: 'Unlock at 5,000 chats — 15% discount + dedicated account manager' },
  ],
  M002: [
    { name: 'First Sale',      tier: 'Bronze',  earned: true,  benefit: 'Revenue tracking dashboard enabled' },
    { name: 'Early Adopter',   tier: 'Bronze',  earned: true,  benefit: 'Exclusive Early Adopter badge on profile' },
    { name: 'Loyal Merchant',  tier: 'Silver',  earned: true,  benefit: 'Free catalog tier upgrade for one month' },
    { name: 'Chat Starter',    tier: 'Bronze',  earned: true,  benefit: '5% discount on next renewal' },
    { name: 'Revenue Pro',     tier: 'Gold',    earned: false, benefit: 'Unlock at KES 250,000 revenue' },
  ],
  M003: [
    { name: 'Chat Master',     tier: 'Gold',    earned: true,  benefit: 'Priority support queue + 8% loyalty discount' },
    { name: 'Automation Master',tier: 'Gold',   earned: true,  benefit: 'Featured in DukaBot merchant success stories' },
    { name: 'Revenue Pro',     tier: 'Gold',    earned: true,  benefit: 'Custom AI tone feature unlocked' },
    { name: 'Revenue Champion',tier: 'Platinum',earned: true,  benefit: '20% perpetual discount + featured case study' },
    { name: 'M-Pesa Champion', tier: 'Silver',  earned: true,  benefit: 'Payment priority routing enabled' },
    { name: 'Chat Legend',     tier: 'Diamond', earned: false, benefit: 'Unlock at 5,000 chats' },
    { name: 'DukaBot Veteran', tier: 'Diamond', earned: false, benefit: 'Unlock at 365 days active' },
  ],
  M004: [
    { name: 'Chat Starter',    tier: 'Bronze',  earned: true,  benefit: '5% discount on next renewal' },
    { name: 'First Sale',      tier: 'Bronze',  earned: true,  benefit: 'Revenue tracking dashboard enabled' },
    { name: 'Revenue Rookie',  tier: 'Silver',  earned: true,  benefit: 'Advanced revenue analytics unlocked' },
    { name: 'Chat Champion',   tier: 'Silver',  earned: false, benefit: 'Unlock at 500 chats' },
  ],
  M005: [
    { name: 'First Conversation', tier: 'Bronze', earned: true,  benefit: 'Analytics dashboard unlocked' },
    { name: 'Chat Starter',    tier: 'Bronze',  earned: false, benefit: 'Unlock at 100 chats' },
  ],
  M006: [
    { name: 'Chat Champion',   tier: 'Silver',  earned: true,  benefit: 'Customer segmentation unlocked' },
    { name: 'Revenue Rookie',  tier: 'Silver',  earned: true,  benefit: 'Advanced revenue analytics unlocked' },
    { name: 'M-Pesa Champion', tier: 'Silver',  earned: true,  benefit: 'Payment priority routing enabled' },
    { name: 'Early Adopter',   tier: 'Bronze',  earned: true,  benefit: 'Exclusive Early Adopter badge on profile' },
    { name: 'Chat Master',     tier: 'Gold',    earned: false, benefit: 'Unlock at 1,000 chats' },
  ],
  M007: [
    { name: 'First Conversation', tier: 'Bronze', earned: true, benefit: 'Analytics dashboard unlocked' },
    { name: 'Chat Starter',    tier: 'Bronze',  earned: false, benefit: 'Suspended before 100 chats — reinstate to continue' },
  ],
  M008: [
    { name: 'Chat Master',     tier: 'Gold',    earned: true,  benefit: 'Priority support queue + 8% loyalty discount' },
    { name: 'Automation Master',tier: 'Gold',   earned: true,  benefit: 'Featured in DukaBot merchant success stories' },
    { name: 'Revenue Pro',     tier: 'Gold',    earned: true,  benefit: 'Custom AI tone feature unlocked' },
    { name: 'Revenue Champion',tier: 'Platinum',earned: true,  benefit: '20% perpetual discount + featured case study' },
    { name: 'Loyal Merchant',  tier: 'Silver',  earned: true,  benefit: 'Free catalog tier upgrade for one month' },
    { name: 'M-Pesa Champion', tier: 'Silver',  earned: true,  benefit: 'Payment priority routing enabled' },
  ],
  M009: [
    { name: 'Chat Starter',    tier: 'Bronze',  earned: true,  benefit: '5% discount on next renewal' },
    { name: 'First Sale',      tier: 'Bronze',  earned: true,  benefit: 'Revenue tracking dashboard enabled' },
    { name: 'Chat Champion',   tier: 'Silver',  earned: false, benefit: 'Cancelled before 500 chats' },
  ],
  M010: [
    { name: 'Chat Starter',    tier: 'Bronze',  earned: true,  benefit: '5% discount on next renewal' },
    { name: 'First Sale',      tier: 'Bronze',  earned: true,  benefit: 'Revenue tracking dashboard enabled' },
    { name: 'Revenue Rookie',  tier: 'Silver',  earned: true,  benefit: 'Advanced revenue analytics unlocked' },
    { name: 'Chat Champion',   tier: 'Silver',  earned: false, benefit: 'Unlock at 500 chats' },
  ],
}

const TIER_DOT: Record<string, string> = {
  Bronze:   'bg-amber-500',
  Silver:   'bg-slate-400',
  Gold:     'bg-yellow-400',
  Diamond:  'bg-cyan-400',
  Platinum: 'bg-indigo-500',
}

function MerchantDetail({ merchant }: { merchant: typeof MERCHANTS[0] }) {
  const [tab, setTab] = useState<HistoryTab>('timeline')

  const sub      = SUBSCRIPTIONS.find(s => s.merchant === merchant.name)
  const payments = PAYMENTS.filter(p => p.merchant === merchant.name)
  const tickets  = SUPPORT_TICKETS.filter(t => t.merchant === merchant.name)
  const activity = (MERCHANT_ACTIVITY[merchant.id] ?? []).slice().reverse()

  const totalPaid = payments.filter(p => p.status === 'success').reduce((a, p) => a + p.amount, 0)

  return (
    <div className="flex-1 min-w-0 space-y-4">
      {/* Merchant header card */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {merchant.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{merchant.name}</h3>
              <StatusBadge status={merchant.status} />
              <Badge variant="outline">{merchant.plan}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-0.5 font-mono">{merchant.whatsapp}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-gray-400">
              <span>ID: <span className="font-mono font-medium text-gray-600 dark:text-gray-300">{merchant.id}</span></span>
              <span>Joined: <span className="font-medium text-gray-600 dark:text-gray-300">{merchant.joined}</span></span>
              <span>Last active: <span className="font-medium text-gray-600 dark:text-gray-300">{merchant.lastActive}</span></span>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
          {[
            { label: 'Total Chats',         value: merchant.chats.toLocaleString(),           color: 'text-indigo-600' },
            { label: 'Revenue Generated',   value: `KES ${merchant.revenue.toLocaleString()}`, color: 'text-green-600'  },
            { label: 'Lifetime Paid',       value: `KES ${totalPaid.toLocaleString()}`,         color: 'text-purple-600' },
            { label: 'Open Tickets',        value: `${tickets.filter(t => t.status === 'open').length}`, color: tickets.some(t => t.status === 'open') ? 'text-yellow-600' : 'text-gray-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription summary */}
      {sub && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Current Subscription</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">{sub.plan} — {sub.billing}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Amount</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{sub.amount > 0 ? `KES ${sub.amount.toLocaleString()}` : 'Free trial'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Payment method</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{sub.method !== '—' ? sub.method : '—'}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Next renewal</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{sub.renewal}</p>
          </div>
          <StatusBadge status={sub.status} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {([
          { id: 'timeline', label: `Timeline (${activity.length})` },
          { id: 'payments', label: `Payments (${payments.length})` },
          { id: 'tickets',  label: `Tickets (${tickets.length})` },
          { id: 'badges',   label: `Badges (${(MERCHANT_BADGES[merchant.id] ?? []).filter(b => b.earned).length})` },
        ] as { id: HistoryTab; label: string }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'timeline' && (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100 dark:bg-gray-800" />
              <div className="space-y-0">
                {activity.map((ev, i) => {
                  const meta = KIND_META[ev.kind]
                  return (
                    <div key={i} className="flex gap-4 relative group">
                      {/* Dot */}
                      <div className={`relative z-10 w-8 h-8 rounded-full ${meta.dot} shrink-0 flex items-center justify-center shadow-sm mt-3`}>
                        {meta.icon}
                      </div>
                      {/* Content */}
                      <div className={`flex-1 py-3 border-b border-gray-50 dark:border-gray-800/60 last:border-0`}>
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ev.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ev.detail}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.dot.replace('bg-', 'bg-').replace('500', '100')} text-gray-700 dark:text-gray-300`}>
                              {meta.label}
                            </span>
                            <p className="text-[11px] text-gray-400 mt-1">{ev.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {activity.length === 0 && (
                  <p className="text-sm text-gray-400 pl-12 py-6">No activity recorded yet.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <Card>
              <CardContent className="p-0">
                {payments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map(p => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs">{p.id}</TableCell>
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
                ) : (
                  <p className="text-sm text-gray-400 p-6">No payment records found for this merchant.</p>
                )}
              </CardContent>
            </Card>
          )}

          {tab === 'tickets' && (
            <div className="space-y-3">
              {tickets.length > 0 ? tickets.map(t => (
                <div key={t.id} className={`bg-white dark:bg-gray-900 border rounded-xl p-4 ${t.status === 'open' ? 'border-yellow-200 dark:border-yellow-900/50' : 'border-gray-100 dark:border-gray-800'}`}>
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs text-gray-400">{t.id}</span>
                        <StatusBadge status={t.priority} />
                        <StatusBadge status={t.status} />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t.subject}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.created} · Assignee: {t.assignee}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400 p-4">No support tickets for this merchant.</p>
              )}
            </div>
          )}

          {tab === 'badges' && (() => {
            const merchantBadges = MERCHANT_BADGES[merchant.id] ?? []
            const earned = merchantBadges.filter(b => b.earned)
            const locked  = merchantBadges.filter(b => !b.earned)
            return (
              <div className="space-y-5">
                {earned.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Earned ({earned.length})</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {earned.map(b => (
                        <div key={b.name} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-center shadow-sm">
                          <div className="flex items-center justify-center gap-1.5 mb-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${TIER_DOT[b.tier] ?? 'bg-gray-400'}`} />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{b.tier}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight">{b.name}</p>
                          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1.5 leading-snug">{b.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {locked.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Locked ({locked.length})</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {locked.map(b => (
                        <div key={b.name} className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-center opacity-55">
                          <div className="flex items-center justify-center gap-1.5 mb-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase">{b.tier}</span>
                          </div>
                          <p className="text-xs font-bold text-gray-500 leading-tight">{b.name}</p>
                          <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">{b.benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {merchantBadges.length === 0 && (
                  <p className="text-sm text-gray-400">No badge data for this merchant yet.</p>
                )}
              </div>
            )
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function HistorySection({ initialMerchantId }: { initialMerchantId?: string | null }) {
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(initialMerchantId ?? null)

  const filtered = MERCHANTS.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.whatsapp.includes(search) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  )

  const selected = MERCHANTS.find(m => m.id === selectedId) ?? null

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Merchant History</h2>
        <p className="text-sm text-gray-500 mt-0.5">Full audit trail — subscriptions, payments, tickets, and activity timeline for every merchant</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left: merchant list */}
        <div className="w-64 shrink-0 flex flex-col gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search merchants…"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400/40 transition-all"
          />
          <div className="flex-1 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                className={`w-full text-left px-3 py-3 transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/30 ${
                  selectedId === m.id ? 'bg-indigo-50 dark:bg-indigo-950/40 border-l-2 border-indigo-500' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                    selectedId === m.id ? 'bg-indigo-600 text-white' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  }`}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{m.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        m.status === 'active' ? 'bg-green-500' :
                        m.status === 'trial'  ? 'bg-blue-500' :
                        m.status === 'suspended' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                      <p className="text-[11px] text-gray-400 capitalize">{m.status} · {m.plan}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No merchants found</p>
            )}
          </div>
        </div>

        {/* Right: merchant detail */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {selected ? (
            <MerchantDetail key={selected.id} merchant={selected} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center gap-3 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-gray-700">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Select a merchant</p>
                <p className="text-xs text-gray-400 mt-0.5">Choose from the list to view their complete history</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Analytics Section ─────────────────────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: 'Nov', revenue: 58000,  merchants: 4  },
  { month: 'Dec', revenue: 81000,  merchants: 5  },
  { month: 'Jan', revenue: 142000, merchants: 7  },
  { month: 'Feb', revenue: 198000, merchants: 8  },
  { month: 'Mar', revenue: 251000, merchants: 9  },
  { month: 'Apr', revenue: 287000, merchants: 10 },
]

const PLAN_MIX = [
  { name: 'Starter', value: 3, color: '#6366f1' },
  { name: 'Growth',  value: 5, color: '#8b5cf6' },
  { name: 'Pro',     value: 2, color: '#a78bfa' },
]

const CHAT_VOLUME = [
  { month: 'Nov', chats: 820  },
  { month: 'Dec', chats: 1240 },
  { month: 'Jan', chats: 2100 },
  { month: 'Feb', chats: 3450 },
  { month: 'Mar', chats: 5280 },
  { month: 'Apr', chats: 6059 },
]

function AdminAnalytics() {
  const growth = Math.round(((MONTHLY_REVENUE[5].revenue - MONTHLY_REVENUE[4].revenue) / MONTHLY_REVENUE[4].revenue) * 100)
  const chatGrowth = Math.round(((CHAT_VOLUME[5].chats - CHAT_VOLUME[4].chats) / CHAT_VOLUME[4].chats) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Platform Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Growth trends, revenue and engagement across all merchants</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'MRR Growth (MoM)',    value: `+${growth}%`,                             color: 'text-green-600'  },
          { label: 'Chat Volume Growth',  value: `+${chatGrowth}%`,                          color: 'text-blue-600'   },
          { label: 'Avg Revenue / Merchant', value: `KES ${Math.round(287000/10).toLocaleString()}`, color: 'text-indigo-600' },
          { label: 'Chats / Merchant',    value: Math.round(6059/10).toLocaleString(),        color: 'text-purple-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Revenue + merchant growth charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Recurring Revenue</CardTitle>
            <CardDescription>KES over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={MONTHLY_REVENUE}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chat Volume Growth</CardTitle>
            <CardDescription>Total chats processed per month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CHAT_VOLUME}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Chats']} />
                <Bar dataKey="chats" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Merchant growth + plan mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Merchant Growth</CardTitle>
            <CardDescription>Cumulative active merchants over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_REVENUE}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v, 'Merchants']} />
                <Bar dataKey="merchants" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Plan Distribution</CardTitle>
            <CardDescription>Active subscriptions by tier</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-8">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={PLAN_MIX} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={70} strokeWidth={2}>
                  {PLAN_MIX.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {PLAN_MIX.map(p => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{p.name}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{p.value} merchants</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retention insight */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Retention &amp; Churn Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Monthly Churn Rate',    value: '10%',  note: '1 cancellation this month',     color: 'text-red-600'    },
              { label: 'Net Revenue Retention', value: '108%', note: 'Upsells outpace churn',          color: 'text-green-600'  },
              { label: 'Trial → Paid Rate',     value: '80%',  note: '4 of 5 trials convert',          color: 'text-indigo-600' },
              { label: 'Avg LTV (Growth)',       value: 'KES 47,988', note: '12-month projected value', color: 'text-purple-600' },
            ].map(({ label, value, note, color }) => (
              <div key={label} className="space-y-1">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{label}</p>
                <p className="text-[11px] text-gray-400">{note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── P&L Section ───────────────────────────────────────────────────────────────
const PNL_MONTHS = [
  { month: 'Nov', revenue: 58000,  costs: 75000,  net: -17000 },
  { month: 'Dec', revenue: 81000,  costs: 78000,  net:   3000 },
  { month: 'Jan', revenue: 142000, costs: 85000,  net:  57000 },
  { month: 'Feb', revenue: 198000, costs: 88000,  net: 110000 },
  { month: 'Mar', revenue: 251000, costs: 92000,  net: 159000 },
  { month: 'Apr', revenue: 287000, costs: 95000,  net: 192000 },
]

const COST_BREAKDOWN = [
  { label: 'WhatsApp Cloud API (Meta)',       monthly: 45000, type: 'fixed',    recommendation: 'MINIMIZE' },
  { label: 'Claude AI (Anthropic API)',        monthly: 28000, type: 'variable', recommendation: 'FOCUS'    },
  { label: 'Infrastructure (Railway + CDN)',   monthly: 12000, type: 'fixed',    recommendation: 'KEEP'     },
  { label: 'Support Staff (1 FTE part-time)', monthly: 35000, type: 'fixed',    recommendation: 'MINIMIZE' },
  { label: 'Email delivery (Resend)',          monthly: 800,   type: 'variable', recommendation: 'KEEP'     },
  { label: 'Domain & SSL',                    monthly: 200,   type: 'fixed',    recommendation: 'KEEP'     },
  { label: 'Manual onboarding calls',         monthly: 8000,  type: 'fixed',    recommendation: 'DROP'     },
  { label: 'Printed marketing materials',     monthly: 5000,  type: 'fixed',    recommendation: 'DROP'     },
  { label: 'Unused SMS backup channel',       monthly: 4000,  type: 'fixed',    recommendation: 'DROP'     },
]

function PnLSection() {
  const thisMonth = PNL_MONTHS[PNL_MONTHS.length - 1]
  const lastMonth = PNL_MONTHS[PNL_MONTHS.length - 2]
  const margin = Math.round((thisMonth.net / thisMonth.revenue) * 100)
  const prevMargin = Math.round((lastMonth.net / lastMonth.revenue) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profit &amp; Loss Account</h2>
        <p className="text-sm text-gray-500 mt-0.5">Platform P&amp;L with strategic recommendations — April 2026</p>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',  value: `KES ${thisMonth.revenue.toLocaleString()}`, color: 'text-green-600' },
          { label: 'Total Costs',    value: `KES ${thisMonth.costs.toLocaleString()}`,   color: 'text-red-600'   },
          { label: 'Net Profit',     value: `KES ${thisMonth.net.toLocaleString()}`,     color: thisMonth.net > 0 ? 'text-green-600' : 'text-red-600' },
          { label: 'Net Margin',     value: `${margin}%`,                                color: margin > prevMargin ? 'text-green-600' : 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500">{label}</p>
            <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* P&L chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Revenue vs Costs vs Net Profit (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={PNL_MONTHS}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `KES ${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} name="Revenue" />
              <Line type="monotone" dataKey="costs"   stroke="#ef4444" strokeWidth={2}   dot={{ r: 3 }} name="Costs"   strokeDasharray="4 2" />
              <Line type="monotone" dataKey="net"     stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} name="Net Profit" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-6 mt-3 justify-center">
            {[['Revenue','#22c55e'],['Costs (dashed)','#ef4444'],['Net Profit','#6366f1']].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-4 h-0.5 rounded" style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost breakdown with recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Cost Breakdown &amp; Strategic Recommendations</CardTitle>
          <CardDescription>What to focus on, minimize, and drop entirely</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cost Line</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Monthly (KES)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COST_BREAKDOWN.map(c => {
                const actionStyle: Record<string, string> = {
                  FOCUS:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
                  MINIMIZE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-500',
                  KEEP:     'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
                  DROP:     'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
                }
                return (
                  <TableRow key={c.label}>
                    <TableCell className="text-sm">{c.label}</TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400 capitalize">{c.type}</span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-right">
                      {c.monthly.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${actionStyle[c.recommendation]}`}>
                        {c.recommendation}
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-gray-50 dark:bg-gray-900/50 font-bold">
                <TableCell colSpan={2} className="text-sm font-bold">Total Monthly Costs</TableCell>
                <TableCell className="text-sm font-bold text-red-600 text-right">
                  {COST_BREAKDOWN.reduce((a,c) => a+c.monthly, 0).toLocaleString()}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Strategy cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            action: 'FOCUS ON',
            color: 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/30',
            titleColor: 'text-indigo-700 dark:text-indigo-400',
            items: [
              'Claude AI API investment — directly drives chat quality and conversion',
              'Pro plan upsells — highest margin (80%+) and stickiest customers',
              'Self-serve onboarding — eliminate manual calls, scale without headcount',
              'Merchant retention — churn is the #1 margin killer at current MRR',
            ],
          },
          {
            action: 'MINIMIZE',
            color: 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30',
            titleColor: 'text-yellow-700 dark:text-yellow-500',
            items: [
              'Support ticket volume — invest in better in-app guidance to reduce ticket rate by 40%',
              'WhatsApp API costs — negotiate volume pricing with Meta at >500K messages/month',
              'Manual billing interventions — automate payment retries and reinstatements',
              'Infrastructure overage — right-size Railway tier to match actual traffic',
            ],
          },
          {
            action: 'DROP ENTIRELY',
            color: 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30',
            titleColor: 'text-red-700 dark:text-red-400',
            items: [
              'Printed marketing materials — zero ROI, digital channels outperform 12× at 1/10 cost',
              'Manual onboarding calls — no correlation with 30-day retention; docs + video do the job',
              'SMS backup channel — zero usage in 90 days, KES 4,000/month wasted',
            ],
          },
        ].map(({ action, color, titleColor, items }) => (
          <div key={action} className={`rounded-2xl border p-5 ${color}`}>
            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${titleColor}`}>{action}</p>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className={`${titleColor} font-bold shrink-0`}>→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
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
  const [focusMerchantId, setFocusMerchantId] = useState<string | null>(null)

  function viewMerchantHistory(id: string) {
    setFocusMerchantId(id)
    setSection('history')
  }

  const SECTION_MAP: Record<AdminSection, React.ReactNode> = {
    dashboard:     <Dashboard />,
    merchants:     <MerchantsSection onViewHistory={viewMerchantHistory} />,
    subscriptions: <SubscriptionsSection />,
    payments:      <PaymentsSection />,
    system:        <SystemHealth />,
    support:       <SupportSection />,
    analytics:     <AdminAnalytics />,
    pnl:           <PnLSection />,
    history:       <HistorySection initialMerchantId={focusMerchantId} />,
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
              <button key={sec} onClick={() => { setSection(sec); if (sec !== 'history') setFocusMerchantId(null) }}
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
