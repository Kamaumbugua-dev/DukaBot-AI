import { ShoppingCart, Users, TrendingUp, DollarSign, MessageSquare, CheckCircle } from 'lucide-react'
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
