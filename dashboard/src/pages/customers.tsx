import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const CUSTOMERS = [
  { id: 'C001', name: 'John Kamau', phone: '+254712345678', orders: 5, totalSpent: 183000, lastSeen: '2 hours ago', status: 'active' },
  { id: 'C002', name: 'Mary Wanjiku', phone: '+254723456789', orders: 3, totalSpent: 24500, lastSeen: '1 day ago', status: 'active' },
  { id: 'C003', name: 'Peter Otieno', phone: '+254734567890', orders: 8, totalSpent: 412000, lastSeen: '3 hours ago', status: 'vip' },
  { id: 'C004', name: 'Grace Njeri', phone: '+254745678901', orders: 2, totalSpent: 17800, lastSeen: '3 days ago', status: 'active' },
  { id: 'C005', name: 'James Maina', phone: '+254756789012', orders: 1, totalSpent: 65000, lastSeen: '5 days ago', status: 'new' },
  { id: 'C006', name: 'Faith Akinyi', phone: '+254767890123', orders: 6, totalSpent: 89200, lastSeen: '1 hour ago', status: 'active' },
]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  vip: 'default',
  active: 'secondary',
  new: 'outline',
}

export function CustomersPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold">231</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">VIP Customers</p>
            <p className="text-2xl font-bold">14</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">New This Week</p>
            <p className="text-2xl font-bold">18</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CUSTOMERS.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs">{c.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.phone}</TableCell>
                  <TableCell>{c.orders}</TableCell>
                  <TableCell>KES {c.totalSpent.toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.lastSeen}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[c.status]}>{c.status}</Badge>
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
