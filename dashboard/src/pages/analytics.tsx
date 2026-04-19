import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'

type Range = 'minutes' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'

const RANGES: { id: Range; label: string }[] = [
  { id: 'minutes', label: 'Minutes'  },
  { id: 'hourly',  label: 'Hourly'   },
  { id: 'daily',   label: 'Daily'    },
  { id: 'weekly',  label: 'Weekly'   },
  { id: 'monthly', label: 'Monthly'  },
  { id: 'yearly',  label: 'Yearly'   },
]

const CHART_DATA: Record<Range, { label: string; chats: number; orders: number; revenue: number }[]> = {
  minutes: [
    { label: '12:00', chats: 2, orders: 0, revenue: 0 },
    { label: '12:05', chats: 1, orders: 1, revenue: 8900 },
    { label: '12:10', chats: 4, orders: 0, revenue: 0 },
    { label: '12:15', chats: 3, orders: 2, revenue: 90000 },
    { label: '12:20', chats: 6, orders: 1, revenue: 3500 },
    { label: '12:25', chats: 2, orders: 0, revenue: 0 },
    { label: '12:30', chats: 5, orders: 3, revenue: 45000 },
    { label: '12:35', chats: 1, orders: 0, revenue: 0 },
  ],
  hourly: [
    { label: '8am',  chats: 4,  orders: 1,  revenue: 3500  },
    { label: '9am',  chats: 9,  orders: 2,  revenue: 8900  },
    { label: '10am', chats: 12, orders: 4,  revenue: 45000 },
    { label: '11am', chats: 18, orders: 5,  revenue: 65000 },
    { label: '12pm', chats: 22, orders: 7,  revenue: 120000},
    { label: '2pm',  chats: 27, orders: 6,  revenue: 89200 },
    { label: '4pm',  chats: 35, orders: 9,  revenue: 183000},
    { label: '6pm',  chats: 19, orders: 3,  revenue: 24500 },
    { label: '8pm',  chats: 8,  orders: 1,  revenue: 2200  },
  ],
  daily: [
    { label: 'Mon', chats: 42, orders: 12, revenue: 145000 },
    { label: 'Tue', chats: 55, orders: 18, revenue: 198000 },
    { label: 'Wed', chats: 38, orders: 9,  revenue: 87000  },
    { label: 'Thu', chats: 61, orders: 22, revenue: 312000 },
    { label: 'Fri', chats: 73, orders: 28, revenue: 412000 },
    { label: 'Sat', chats: 89, orders: 35, revenue: 520000 },
    { label: 'Sun', chats: 47, orders: 14, revenue: 167000 },
  ],
  weekly: [
    { label: 'Wk 1', chats: 180, orders: 48,  revenue: 620000  },
    { label: 'Wk 2', chats: 240, orders: 65,  revenue: 890000  },
    { label: 'Wk 3', chats: 310, orders: 81,  revenue: 1200000 },
    { label: 'Wk 4', chats: 275, orders: 72,  revenue: 980000  },
  ],
  monthly: [
    { label: 'Jan', chats: 820,  orders: 195, revenue: 2800000 },
    { label: 'Feb', chats: 940,  orders: 230, revenue: 3400000 },
    { label: 'Mar', chats: 1100, orders: 285, revenue: 4200000 },
    { label: 'Apr', chats: 1280, orders: 320, revenue: 4900000 },
  ],
  yearly: [
    { label: '2023', chats: 4200,  orders: 980,  revenue: 14000000 },
    { label: '2024', chats: 8800,  orders: 2100, revenue: 31000000 },
    { label: '2025', chats: 14500, orders: 3600, revenue: 52000000 },
    { label: '2026', chats: 5200,  orders: 1300, revenue: 19000000 },
  ],
}

const SUMMARY: Record<Range, { chats: number; orders: number; revenue: number; label: string }> = {
  minutes: { chats: 24,    orders: 7,    revenue: 147400,   label: 'last 40 min'   },
  hourly:  { chats: 154,   orders: 38,   revenue: 541300,   label: 'today'         },
  daily:   { chats: 405,   orders: 138,  revenue: 1841000,  label: 'this week'     },
  weekly:  { chats: 1005,  orders: 266,  revenue: 3690000,  label: 'this month'    },
  monthly: { chats: 4140,  orders: 1030, revenue: 15300000, label: 'this year'     },
  yearly:  { chats: 32700, orders: 7980, revenue: 116000000,label: 'all time'      },
}

const categoryRevenue = [
  { name: 'Phones',  value: 312000 },
  { name: 'TVs',     value: 198000 },
  { name: 'Kitchen', value: 87000  },
  { name: 'Laptops', value: 145000 },
  { name: 'Other',   value: 42000  },
]
const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

const chatsConfig   = { chats:   { label: 'Chats',   color: 'hsl(var(--chart-1))' } }
const ordersConfig  = { orders:  { label: 'Orders',  color: 'hsl(var(--chart-2))' } }
const revenueConfig = { revenue: { label: 'Revenue', color: 'hsl(var(--chart-3))' } }

function fmt(n: number) {
  if (n >= 1_000_000) return `KES ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `KES ${(n / 1_000).toFixed(0)}K`
  return `KES ${n.toLocaleString()}`
}

export function AnalyticsPage() {
  const [range, setRange] = useState<Range>('daily')
  const data    = CHART_DATA[range]
  const summary = SUMMARY[range]

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: `Chats (${summary.label})`,   value: summary.chats.toLocaleString(),  sub: '↑ 12% vs prev'  },
          { label: `Orders (${summary.label})`,  value: summary.orders.toLocaleString(), sub: '↑ 8% vs prev'   },
          { label: `Revenue (${summary.label})`, value: fmt(summary.revenue),            sub: '↑ 15% vs prev'  },
          { label: 'M-Pesa Success Rate',        value: '97%',                           sub: '↑ 1% vs prev'   },
        ].map(({ label, value, sub }) => (
          <Card key={label}>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground leading-tight">{label}</p>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <p className="text-xs text-green-600 mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Time range slider */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>WhatsApp chats and orders — adjust the time range below</CardDescription>
            </div>
            <div className="flex gap-1 bg-muted rounded-xl p-1">
              {RANGES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setRange(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    range === r.id
                      ? 'bg-background shadow text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chat volume */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">WhatsApp Chats</p>
            <ChartContainer config={chatsConfig} className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={range === 'minutes' ? 20 : undefined}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="chats" fill="var(--color-chats)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Orders */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Orders Processed</p>
            <ChartContainer config={ordersConfig} className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Revenue line */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Revenue (KES)</p>
            <ChartContainer config={revenueConfig} className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Revenue by category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>KES breakdown by product type (all time)</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart width={280} height={200}>
              <Pie data={categoryRevenue} cx={140} cy={90} innerRadius={50} outerRadius={80} dataKey="value">
                {categoryRevenue.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconSize={10} />
            </PieChart>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {[
              { label: 'Avg Order Value',   value: 'KES 18,200' },
              { label: 'Cart Abandonment',  value: '22%'        },
              { label: 'Repeat Customers',  value: '41%'        },
              { label: 'M-Pesa Success',    value: '97%'        },
              { label: 'Avg Response Time', value: '1.4 sec'    },
              { label: 'Bot Containment',   value: '88%'        },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
