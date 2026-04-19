import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ALL_ORDERS = [
  { id: 'ORD-001', customer: 'John Kamau',    phone: '+254712345678', item: 'Samsung TV 43"',  amount: 45000,  status: 'paid',      date: '2026-04-18' },
  { id: 'ORD-002', customer: 'Mary Wanjiku',  phone: '+254723456789', item: 'Blender Pro',     amount: 3500,   status: 'pending',   date: '2026-04-18' },
  { id: 'ORD-003', customer: 'Peter Otieno',  phone: '+254734567890', item: 'iPhone 15',       amount: 120000, status: 'paid',      date: '2026-04-17' },
  { id: 'ORD-004', customer: 'Grace Njeri',   phone: '+254745678901', item: 'Air Fryer',       amount: 8900,   status: 'shipped',   date: '2026-04-17' },
  { id: 'ORD-005', customer: 'James Maina',   phone: '+254756789012', item: 'Laptop HP 15"',   amount: 65000,  status: 'paid',      date: '2026-04-16' },
  { id: 'ORD-006', customer: 'Faith Akinyi',  phone: '+254767890123', item: 'Electric Kettle', amount: 2200,   status: 'cancelled', date: '2026-04-16' },
  { id: 'ORD-007', customer: 'David Kipchoge',phone: '+254778901234', item: 'Microwave 20L',   amount: 12000,  status: 'pending',   date: '2026-04-15' },
]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  paid: 'default', pending: 'secondary', shipped: 'outline', cancelled: 'destructive',
}

type ExportFormat = 'csv' | 'json' | 'excel' | 'pdf'

function exportOrders(data: typeof ALL_ORDERS, format: ExportFormat) {
  const filename = `dukabot-orders-${new Date().toISOString().slice(0, 10)}`

  if (format === 'json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    triggerDownload(blob, `${filename}.json`)
    return
  }

  if (format === 'csv' || format === 'excel') {
    const headers = ['Order ID', 'Customer', 'Phone', 'Item', 'Amount (KES)', 'Status', 'Date']
    const rows = data.map(o => [o.id, o.customer, o.phone, o.item, o.amount, o.status, o.date])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const ext = format === 'excel' ? 'xls' : 'csv'
    const blob = new Blob([csv], { type: 'text/csv' })
    triggerDownload(blob, `${filename}.${ext}`)
    return
  }

  if (format === 'pdf') {
    const html = `
      <html><head><title>DukaBot Orders</title>
      <style>body{font-family:sans-serif;padding:24px}h1{font-size:18px;margin-bottom:16px}
      table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left}
      th{background:#f4f4f4;font-weight:600}</style></head>
      <body><h1>Orders Export — ${new Date().toLocaleDateString()}</h1>
      <table><tr>${['Order ID','Customer','Phone','Item','Amount','Status','Date'].map(h=>`<th>${h}</th>`).join('')}</tr>
      ${data.map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.phone}</td><td>${o.item}</td><td>KES ${o.amount.toLocaleString()}</td><td>${o.status}</td><td>${o.date}</td></tr>`).join('')}
      </table></body></html>`
    const w = window.open('', '_blank')!
    w.document.write(html)
    w.document.close()
    w.print()
  }
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function ExportButton({ data }: { data: typeof ALL_ORDERS }) {
  const [open, setOpen] = useState(false)
  const formats: { format: ExportFormat; label: string; icon: string }[] = [
    { format: 'csv',   label: 'CSV',   icon: '📄' },
    { format: 'excel', label: 'Excel', icon: '📊' },
    { format: 'json',  label: 'JSON',  icon: '📋' },
    { format: 'pdf',   label: 'PDF',   icon: '🖨️' },
  ]
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-all"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Export
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-background border border-border rounded-xl shadow-lg py-1 w-36 overflow-hidden">
            {formats.map(({ format, label, icon }) => (
              <button
                key={format}
                onClick={() => { exportOrders(data, format); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
              >
                <span>{icon}</span>
                <span>Download {label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function OrdersPage() {
  const [filter, setFilter] = useState('all')
  const orders = filter === 'all' ? ALL_ORDERS : ALL_ORDERS.filter((o) => o.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">All Orders</h2>
        <div className="flex items-center gap-2">
          <ExportButton data={orders} />
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
