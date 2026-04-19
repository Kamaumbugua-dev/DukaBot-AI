import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Page } from '@/App'

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

interface Props {
  onNavigate: (page: Page) => void
}

const GREETINGS: Record<'english' | 'swahili', string> = {
  english: 'Hello! Welcome to Luthuli Electronics 🛍️ How can I help you today?',
  swahili: 'Habari! Karibu Luthuli Electronics 🛍️ Naweza kukusaidia vipi leo?',
}

export function SettingsPage({ onNavigate }: Props) {
  const [cancelStep, setCancelStep]   = useState<'idle' | 'confirm' | 'done'>('idle')
  const [language, setLanguage]       = useState<'english' | 'swahili'>('swahili')
  const [greeting, setGreeting]       = useState(GREETINGS['swahili'])
  const [greetingSaved, setGreetingSaved] = useState(false)

  function handleLanguageToggle(lang: 'english' | 'swahili') {
    setLanguage(lang)
    setGreeting(GREETINGS[lang])
    setGreetingSaved(false)
  }

  function handleSaveGreeting() {
    setGreetingSaved(true)
    setTimeout(() => setGreetingSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Merchant Info */}
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

      {/* Integrations */}
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

      {/* AI Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
          <CardDescription>DukaBot agent settings — changes take effect immediately</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-2">
          {/* Language toggle */}
          <div className="flex items-start justify-between gap-4 py-3 border-b">
            <div className="flex-1">
              <p className="text-sm font-medium">Agent Language</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {language === 'swahili'
                  ? 'DukaBot responds in Swahili. English inputs are still understood.'
                  : 'DukaBot responds in English.'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1 shrink-0">
              {(['english', 'swahili'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageToggle(lang)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${
                    language === lang
                      ? 'bg-background shadow text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang === 'english' ? '🇬🇧 English' : '🇰🇪 Swahili'}
                </button>
              ))}
            </div>
          </div>

          {/* Greeting message */}
          <div className="space-y-2 py-3 border-b">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Greeting Message</p>
                <p className="text-xs text-muted-foreground">Sent to every new customer who messages DukaBot</p>
              </div>
              {greetingSaved && (
                <span className="text-xs text-green-600 font-medium">✓ Saved &amp; live</span>
              )}
            </div>
            <textarea
              value={greeting}
              onChange={e => { setGreeting(e.target.value); setGreetingSaved(false) }}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground resize-none outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
            <button
              onClick={handleSaveGreeting}
              className="rounded-lg px-4 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              Save Greeting
            </button>
          </div>

          <SettingRow label="Max Cart Items" value="10 items per session" />
          <SettingRow label="Payment Timeout" value="10 minutes (STK push)" />
          <SettingRow label="Guardrails" value="Prompt injection protection · PII redaction" status="active" />
        </CardContent>
      </Card>

      {/* Subscription Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>Manage your DukaBot billing plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium">Current Plan</p>
              <p className="text-xs text-muted-foreground">Growth — KES 3,999/month · Renews May 19, 2026</p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <Separator />
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('pricing')}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
            >
              View All Plans &amp; Upgrade
            </button>
            {cancelStep === 'idle' && (
              <button
                onClick={() => setCancelStep('confirm')}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-destructive text-destructive hover:bg-destructive/5 active:scale-[0.98] transition-all"
              >
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Confirmation step */}
          {cancelStep === 'confirm' && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">Cancel your Growth plan?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your access continues until <strong>May 19, 2026</strong>. After that, DukaBot will stop responding to your customers. You will not be charged again.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCancelStep('done')}
                  className="flex-1 rounded-lg py-2 text-xs font-semibold bg-destructive text-white hover:opacity-90 transition-all"
                >
                  Yes, Cancel Subscription
                </button>
                <button
                  onClick={() => setCancelStep('idle')}
                  className="flex-1 rounded-lg py-2 text-xs font-semibold border border-border text-foreground hover:bg-muted transition-all"
                >
                  Keep My Plan
                </button>
              </div>
            </div>
          )}

          {/* Done step */}
          {cancelStep === 'done' && (
            <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 p-4 space-y-1">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Cancellation confirmed</p>
              <p className="text-xs text-green-600 dark:text-green-500 leading-relaxed">
                Your access continues until <strong>May 19, 2026</strong>. You will not be charged again. We're sorry to see you go — your data will be retained for 30 days after expiry.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
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
