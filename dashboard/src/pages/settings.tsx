import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import PricingCard from '@/components/pricing-card'

function SettingRow({ label, value, status }: { label: string; value: string; status?: 'active' | 'inactive' }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
      {status && (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      )}
    </div>
  )
}

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Merchant Info</CardTitle>
          <CardDescription>Your store details used by DukaBot</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingRow label="Store Name" value="Luthuli Electronics" />
          <SettingRow label="WhatsApp Number" value="+254700123456" status="active" />
          <SettingRow label="Location" value="Luthuli Avenue, Nairobi CBD" />
          <SettingRow label="Currency" value="KES (Kenyan Shilling)" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>API connections status</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingRow label="WhatsApp Cloud API" value="Meta Business · Webhook verified" status="active" />
          <SettingRow label="M-Pesa Daraja" value="Safaricom · Paybill 522522" status="active" />
          <SettingRow label="Claude AI" value="Anthropic · claude-sonnet-4-6" status="active" />
          <SettingRow label="PostgreSQL" value="Railway · dukabot-prod" status="active" />
          <SettingRow label="Redis Cache" value="Railway · session store" status="active" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
          <CardDescription>DukaBot agent settings</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          <SettingRow label="Agent Language" value="Kenglish (English + Swahili mix)" />
          <SettingRow label="Greeting Message" value="Habari! Welcome to Luthuli Electronics 🛍️" />
          <SettingRow label="Max Cart Items" value="10 items per session" />
          <SettingRow label="Payment Timeout" value="10 minutes (STK push)" />
          <SettingRow label="Guardrails" value="Prompt injection protection · PII redaction" status="active" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>Manage your DukaBot billing plan</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <PricingCard />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible actions — contact support to proceed</CardDescription>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Reset catalog · Export data · Delete account</p>
            <p className="text-xs text-muted-foreground">Email: support@axonlattice.dev</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
