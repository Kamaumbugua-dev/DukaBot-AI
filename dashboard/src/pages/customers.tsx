import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const CUSTOMERS = [
  { id: 'C001', name: 'John Kamau',    phone: '+254712345678', orders: 5,  totalSpent: 183000, lastSeen: '2 hours ago',  status: 'active' },
  { id: 'C002', name: 'Mary Wanjiku', phone: '+254723456789', orders: 3,  totalSpent: 24500,  lastSeen: '1 day ago',    status: 'active' },
  { id: 'C003', name: 'Peter Otieno', phone: '+254734567890', orders: 8,  totalSpent: 412000, lastSeen: '3 hours ago',  status: 'vip'    },
  { id: 'C004', name: 'Grace Njeri',  phone: '+254745678901', orders: 2,  totalSpent: 17800,  lastSeen: '3 days ago',   status: 'active' },
  { id: 'C005', name: 'James Maina',  phone: '+254756789012', orders: 1,  totalSpent: 65000,  lastSeen: '5 days ago',   status: 'new'    },
  { id: 'C006', name: 'Faith Akinyi', phone: '+254767890123', orders: 6,  totalSpent: 89200,  lastSeen: '1 hour ago',   status: 'active' },
]

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  vip: 'default', active: 'secondary', new: 'outline',
}

type ExportFormat = 'csv' | 'json' | 'excel' | 'pdf'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

function exportCustomers(data: typeof CUSTOMERS, format: ExportFormat) {
  const filename = `dukabot-customers-${new Date().toISOString().slice(0, 10)}`

  if (format === 'json') {
    triggerDownload(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${filename}.json`)
    return
  }
  if (format === 'csv' || format === 'excel') {
    const headers = ['ID', 'Name', 'Phone', 'Orders', 'Total Spent (KES)', 'Last Seen', 'Status']
    const rows = data.map(c => [c.id, c.name, c.phone, c.orders, c.totalSpent, c.lastSeen, c.status])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    triggerDownload(new Blob([csv], { type: 'text/csv' }), `${filename}.${format === 'excel' ? 'xls' : 'csv'}`)
    return
  }
  if (format === 'pdf') {
    const html = `<html><head><title>DukaBot Customers</title>
    <style>body{font-family:sans-serif;padding:24px}h1{font-size:18px;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left}
    th{background:#f4f4f4;font-weight:600}</style></head>
    <body><h1>Customers Export — ${new Date().toLocaleDateString()}</h1>
    <table><tr>${['Name','Phone','Orders','Total Spent','Last Seen','Status'].map(h=>`<th>${h}</th>`).join('')}</tr>
    ${data.map(c=>`<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.orders}</td><td>KES ${c.totalSpent.toLocaleString()}</td><td>${c.lastSeen}</td><td>${c.status}</td></tr>`).join('')}
    </table></body></html>`
    const w = window.open('', '_blank')!
    w.document.write(html); w.document.close(); w.print()
  }
}

function ExportButton({ data }: { data: typeof CUSTOMERS }) {
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
                onClick={() => { exportCustomers(data, format); setOpen(false) }}
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

export function CustomersPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-bold">231</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">VIP Customers</p>
          <p className="text-2xl font-bold">14</p>
        </CardContent></Card>
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground">New This Week</p>
          <p className="text-2xl font-bold">18</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Customer List</CardTitle>
            <ExportButton data={CUSTOMERS} />
          </div>
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
