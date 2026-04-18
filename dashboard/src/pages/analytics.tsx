import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const weeklyOrders = [
  { week: 'W1', orders: 18 },
  { week: 'W2', orders: 24 },
  { week: 'W3', orders: 31 },
  { week: 'W4', orders: 27 },
]

const categoryRevenue = [
  { name: 'Phones', value: 312000 },
  { name: 'TVs', value: 198000 },
  { name: 'Kitchen', value: 87000 },
  { name: 'Laptops', value: 145000 },
  { name: 'Other', value: 42000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A78BFA']

const hourlyChats = [
  { hour: '8am', chats: 4 },
  { hour: '10am', chats: 12 },
  { hour: '12pm', chats: 18 },
  { hour: '2pm', chats: 22 },
  { hour: '4pm', chats: 27 },
  { hour: '6pm', chats: 35 },
  { hour: '8pm', chats: 19 },
  { hour: '10pm', chats: 8 },
]

const ordersConfig = { orders: { label: 'Orders', color: 'hsl(var(--chart-1))' } }
const chatsConfig = { chats: { label: 'Chats', color: 'hsl(var(--chart-2))' } }

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Orders</CardTitle>
            <CardDescription>Orders processed per week this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ordersConfig} className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOrders}>
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>KES revenue breakdown by product type</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart width={280} height={200}>
              <Pie
                data={categoryRevenue}
                cx={140}
                cy={90}
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {categoryRevenue.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconSize={10} />
            </PieChart>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Chat Volume</CardTitle>
          <CardDescription>WhatsApp conversations by hour (today)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chatsConfig} className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyChats}>
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="chats" fill="var(--color-chats)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Avg Order Value', value: 'KES 18,200' },
          { label: 'Cart Abandonment', value: '22%' },
          { label: 'Repeat Customers', value: '41%' },
          { label: 'M-Pesa Success', value: '97%' },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
