import { useState } from 'react'
import { ShoppingCart, Users, TrendingUp, DollarSign, MessageSquare, CheckCircle, Trophy, Star, Zap, Shield, Clock, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarGroup, AvatarMore } from '@/components/shadcnblocks/avatar-group'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts'

// ── Badge system ─────────────────────────────────────────────────────────────
type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'platinum'

interface MerchantBadge {
  id: string
  name: string
  description: string
  milestone: string
  benefit: string
  tier: BadgeTier
  earned: boolean
  earnedAt?: string
  icon: React.ElementType
}

const TIER_STYLE: Record<BadgeTier, { ring: string; bg: string; text: string; label: string; glow: string }> = {
  bronze:   { ring: 'ring-amber-600/50',   bg: 'bg-amber-50 dark:bg-amber-950/40',   text: 'text-amber-700 dark:text-amber-400',   label: 'Bronze',   glow: 'shadow-amber-200 dark:shadow-amber-900/40'   },
  silver:   { ring: 'ring-slate-400/60',   bg: 'bg-slate-50 dark:bg-slate-900/40',   text: 'text-slate-600 dark:text-slate-300',   label: 'Silver',   glow: 'shadow-slate-200 dark:shadow-slate-800/40'   },
  gold:     { ring: 'ring-yellow-400/60',  bg: 'bg-yellow-50 dark:bg-yellow-950/40', text: 'text-yellow-700 dark:text-yellow-400', label: 'Gold',     glow: 'shadow-yellow-200 dark:shadow-yellow-900/40' },
  diamond:  { ring: 'ring-cyan-400/60',    bg: 'bg-cyan-50 dark:bg-cyan-950/40',     text: 'text-cyan-700 dark:text-cyan-400',     label: 'Diamond',  glow: 'shadow-cyan-200 dark:shadow-cyan-900/40'     },
  platinum: { ring: 'ring-indigo-400/60',  bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', label: 'Platinum', glow: 'shadow-indigo-200 dark:shadow-indigo-900/40' },
}

const BADGES: MerchantBadge[] = [
  {
    id: 'first_chat',    name: 'First Conversation', tier: 'bronze',
    description: 'Your DukaBot handled its first customer chat.',
    milestone: '1 chat',  benefit: 'Analytics dashboard unlocked',
    earned: true, earnedAt: 'Jan 12', icon: MessageSquare,
  },
  {
    id: 'chat_100',      name: 'Chat Starter',       tier: 'bronze',
    description: 'DukaBot has handled 100 customer conversations for your shop.',
    milestone: '100 chats', benefit: '5% discount on next renewal',
    earned: true, earnedAt: 'Jan 19', icon: MessageSquare,
  },
  {
    id: 'chat_500',      name: 'Chat Champion',      tier: 'silver',
    description: 'Five hundred conversations handled — your shop never sleeps.',
    milestone: '500 chats', benefit: 'Customer segmentation unlocked',
    earned: true, earnedAt: 'Feb 4', icon: MessageSquare,
  },
  {
    id: 'chat_1000',     name: 'Chat Master',        tier: 'gold',
    description: 'One thousand chats — DukaBot is now your best employee.',
    milestone: '1,000 chats', benefit: 'Priority support queue + 8% loyalty discount',
    earned: true, earnedAt: 'Mar 28', icon: Trophy,
  },
  {
    id: 'chat_5000',     name: 'Chat Legend',        tier: 'diamond',
    description: 'Five thousand conversations — top 1% of DukaBot merchants.',
    milestone: '5,000 chats', benefit: '15% discount + dedicated account manager',
    earned: false, icon: Trophy,
  },
  {
    id: 'first_sale',    name: 'First Sale',         tier: 'bronze',
    description: 'Your first M-Pesa payment was collected via DukaBot.',
    milestone: 'KES 1,000 revenue', benefit: 'Revenue tracking dashboard enabled',
    earned: true, earnedAt: 'Jan 12', icon: DollarSign,
  },
  {
    id: 'revenue_50k',   name: 'Revenue Rookie',     tier: 'silver',
    description: 'KES 50,000 in total revenue collected through DukaBot.',
    milestone: 'KES 50,000 revenue', benefit: 'Advanced revenue analytics unlocked',
    earned: true, earnedAt: 'Feb 18', icon: TrendingUp,
  },
  {
    id: 'revenue_250k',  name: 'Revenue Pro',        tier: 'gold',
    description: 'A quarter million shillings — your shop is scaling.',
    milestone: 'KES 250,000 revenue', benefit: 'Custom AI tone feature unlocked',
    earned: false, icon: TrendingUp,
  },
  {
    id: 'revenue_1m',    name: 'Revenue Champion',   tier: 'platinum',
    description: 'KES 1,000,000 in revenue — you are a DukaBot success story.',
    milestone: 'KES 1,000,000 revenue', benefit: '20% perpetual discount + featured case study',
    earned: false, icon: Star,
  },
  {
    id: 'loyalty_30',    name: 'Early Adopter',      tier: 'bronze',
    description: 'Thirty days on DukaBot — you were here before the crowd.',
    milestone: '30 days active', benefit: 'Exclusive Early Adopter badge displayed on profile',
    earned: true, earnedAt: 'Feb 11', icon: Clock,
  },
  {
    id: 'loyalty_90',    name: 'Loyal Merchant',     tier: 'silver',
    description: 'Three months of continuous DukaBot use.',
    milestone: '90 days active', benefit: 'Free catalog tier upgrade for one month',
    earned: true, earnedAt: 'Apr 11', icon: Shield,
  },
  {
    id: 'loyalty_365',   name: 'DukaBot Veteran',    tier: 'diamond',
    description: 'One full year powering your shop with DukaBot AI.',
    milestone: '365 days active', benefit: 'Lifetime 5% discount on all renewals',
    earned: false, icon: Award,
  },
  {
    id: 'automation_pro',name: 'Automation Master',  tier: 'gold',
    description: '80% or more of chats resolved by DukaBot without merchant input.',
    milestone: '80%+ bot containment', benefit: 'Featured in DukaBot merchant success stories',
    earned: true, earnedAt: 'Mar 5', icon: Zap,
  },
  {
    id: 'mpesa_pro',     name: 'M-Pesa Champion',   tier: 'silver',
    description: '50 successful STK Push payments collected through DukaBot.',
    milestone: '50 M-Pesa payments', benefit: 'Payment priority routing enabled',
    earned: true, earnedAt: 'Feb 28', icon: CheckCircle,
  },
]

function BadgesCard() {
  const earned = BADGES.filter(b => b.earned)
  const locked  = BADGES.filter(b => !b.earned)
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Badges &amp; Awards
          </CardTitle>
          <CardDescription>{earned.length} earned · {locked.length} locked</CardDescription>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {(['bronze','silver','gold','diamond','platinum'] as BadgeTier[]).map(tier => {
            const count = earned.filter(b => b.tier === tier).length
            if (!count) return null
            const s = TIER_STYLE[tier]
            return (
              <span key={tier} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                {count} {s.label}
              </span>
            )
          })}
        </div>
      </CardHeader>
      <CardContent>
        {/* Earned badges */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Earned</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-6">
          {earned.map(badge => {
            const s = TIER_STYLE[badge.tier]
            const Icon = badge.icon
            const isOpen = expanded === badge.id
            return (
              <button
                key={badge.id}
                onClick={() => setExpanded(isOpen ? null : badge.id)}
                className={`relative flex flex-col items-center text-center rounded-2xl p-3 ring-2 transition-all hover:scale-[1.03] active:scale-[0.98] shadow-md ${s.ring} ${s.bg} ${s.glow}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${s.bg} ring-2 ${s.ring}`}>
                  <Icon className={`h-5 w-5 ${s.text}`} />
                </div>
                <p className={`text-xs font-bold leading-tight ${s.text}`}>{badge.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{badge.earnedAt}</p>
                {isOpen && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 w-52 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl p-3 text-left">
                    <p className={`text-xs font-bold mb-1 ${s.text}`}>{badge.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{badge.description}</p>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 mb-2" />
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Benefit</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{badge.benefit}</p>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Locked badges */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Locked — Keep going!</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {locked.map(badge => {
            const Icon = badge.icon
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center rounded-2xl p-3 ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-50 dark:bg-gray-900/50 opacity-60"
              >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs font-bold text-gray-400 leading-tight">{badge.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{badge.milestone}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

const revenueData = [
  { day: 'Mon', revenue: 12400 },
  { day: 'Tue', revenue: 18200 },
  { day: 'Wed', revenue: 15800 },
  { day: 'Thu', revenue: 22100 },
  { day: 'Fri', revenue: 28600 },
  { day: 'Sat', revenue: 35200 },
  { day: 'Sun', revenue: 19800 },
]

const recentOrders = [
  { id: 'ORD-001', customer: 'John Kamau', item: 'Samsung TV 43"', amount: 45000, status: 'paid' },
  { id: 'ORD-002', customer: 'Mary Wanjiku', item: 'Blender Pro', amount: 3500, status: 'pending' },
  { id: 'ORD-003', customer: 'Peter Otieno', item: 'iPhone 15', amount: 120000, status: 'paid' },
  { id: 'ORD-004', customer: 'Grace Njeri', item: 'Air Fryer', amount: 8900, status: 'shipped' },
]

const chartConfig = {
  revenue: { label: 'Revenue (KES)', color: 'hsl(var(--chart-1))' },
}

const ACTIVE_CUSTOMERS = [
  { name: 'John Kamau', initials: 'JK', lastSeen: '2 min ago' },
  { name: 'Faith Akinyi', initials: 'FA', lastSeen: '8 min ago' },
  { name: 'Peter Otieno', initials: 'PO', lastSeen: '15 min ago' },
  { name: 'Mary Wanjiku', initials: 'MW', lastSeen: '22 min ago' },
  { name: 'Grace Njeri', initials: 'GN', lastSeen: '31 min ago' },
]
const OVERFLOW_COUNT = 18

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'default',
  pending: 'secondary',
  shipped: 'outline',
}

export function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="KES 152,800"
          delta="+12% this week"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Orders"
          value="84"
          delta="+7 today"
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Customers"
          value="231"
          delta="+18 this week"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Conversion"
          value="34%"
          delta="Chat → Purchase"
          icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
            <CardDescription>KES revenue this week via M-Pesa</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="url(#revGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Performance</CardTitle>
            <CardDescription>DukaBot stats today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AiStat label="Chats handled" value="142" icon={<MessageSquare className="h-4 w-4" />} />
            <AiStat label="Orders placed" value="48" icon={<ShoppingCart className="h-4 w-4" />} />
            <AiStat label="Payments confirmed" value="41" icon={<CheckCircle className="h-4 w-4" />} />
            <AiStat label="Avg response time" value="1.2s" icon={<TrendingUp className="h-4 w-4" />} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Recently Active Customers</CardTitle>
            <CardDescription>Chatting with DukaBot in the last hour</CardDescription>
          </div>
          <AvatarGroup>
            {ACTIVE_CUSTOMERS.map((c) => (
              <Avatar key={c.name} className="h-8 w-8">
                <AvatarFallback className="text-xs">{c.initials}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarMore count={OVERFLOW_COUNT} />
          </AvatarGroup>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ACTIVE_CUSTOMERS.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">{c.initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium flex-1">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.lastSeen}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <BadgesCard />

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Last 4 orders from WhatsApp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.item} · {order.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">KES {order.amount.toLocaleString()}</span>
                  <Badge variant={STATUS_COLORS[order.status]}>{order.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ title, value, delta, icon }: { title: string; value: string; delta: string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{delta}</p>
      </CardContent>
    </Card>
  )
}

function AiStat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}
