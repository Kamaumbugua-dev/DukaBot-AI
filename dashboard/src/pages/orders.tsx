import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ALL_ORDERS = [
  { id: 'ORD-001', customer: 'John Kamau', phone: '+254712345678', item: 'Samsung TV 43"', amount: 45000, status: 'paid', date: '2026-04-18' },
  { id: 'ORD-002', customer: 'Mary Wanjiku', phone: '+254723456789', item: 'Blender Pro', amount: 3500, status: 'pending', date: '2026-04-18' },
  { id: 'ORD-003', customer: 'Peter Otieno', phone: '+254734567890', item: 'iPhone 15', amount: 120000, status: 'paid', date: '2026-04-17' },
  { id: 'ORD-004', customer: 'Grace Njeri', phone: '+254745678901', item: 'Air Fryer', amount: 8900, status: 'shipped', date: '2026-04-17' },
  { id: 'ORD-005', customer: 'James Maina', phone: '+254756789012', item: 'Laptop HP 15"', amount: 65000, status: 'paid', date: '2026-04-16' },
  { id: 'ORD-006', customer: 'Faith Akinyi', phone: '+254767890123', item: 'Electric Kettle', amount: 2200, status: 'cancelled', date: '2026-04-16' },
  { id: 'ORD-007', customer: 'David Kipchoge', phone: '+254778901234', item: 'Microwave 20L', amount: 12000, status: 'pending', date: '2026-04-15' },
]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'default',
  pending: 'secondary',
  shipped: 'outline',
  cancelled: 'destructive',
}

export function OrdersPage() {
  const [filter, setFilter] = useState('all')

  const orders = filter === 'all' ? ALL_ORDERS : ALL_ORDERS.filter((o) => o.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Orders</h2>
        <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.phone}</TableCell>
                  <TableCell>{order.item}</TableCell>
                  <TableCell>KES {order.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
