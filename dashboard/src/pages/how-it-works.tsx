import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const STEPS = [
  {
    n: '01',
    title: 'Connect your WhatsApp Business number',
    desc: 'Link your WhatsApp Business account via Meta\'s Cloud API. Takes under 5 minutes. No new number needed — your existing business line works fine.',
    detail: 'DukaBot registers a webhook on your number. All incoming messages are routed through our AI pipeline. You keep access to WhatsApp Business Manager and can monitor conversations anytime.',
  },
  {
    n: '02',
    title: 'Upload your product catalog',
    desc: 'Add products with names, prices, photos, and stock levels. You can import a CSV or add items one by one from the dashboard.',
    detail: 'The AI uses your catalog as its source of truth. When a customer asks "unazo blender?" DukaBot searches your catalog, responds with matching items, prices in KES, and photos — automatically.',
  },
  {
    n: '03',
    title: 'Set your M-Pesa Paybill or Till',
    desc: 'Enter your Safaricom Daraja API credentials. DukaBot will trigger STK Push payments directly to the customer\'s phone during checkout.',
    detail: 'When a customer confirms their order, DukaBot sends an M-Pesa STK Push. The customer enters their PIN. DukaBot listens for the Daraja callback and marks the order as paid — all within the chat.',
  },
  {
    n: '04',
    title: 'DukaBot handles everything else',
    desc: 'Greet customers, answer product questions, build carts, collect delivery addresses, confirm payments, and send receipts — all automatically, in real time.',
    detail: 'The AI handles Kenglish naturally — "niambie bei ya hii" works just as well as "what\'s the price of this?". It escalates to you only when it genuinely needs a human decision.',
  },
  {
    n: '05',
    title: 'You track sales from this dashboard',
    desc: 'Every order, customer, and payment lands in your dashboard. See revenue trends, top products, and customer activity — all in one place.',
    detail: 'Analytics update in real time. Export data any time. Get notified when orders need your attention. You stay in control while DukaBot does the heavy lifting.',
  },
]

export function HowItWorksPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div className="space-y-3">
        <Badge variant="secondary">How it works</Badge>
        <h1 className="text-3xl font-bold tracking-tight">From WhatsApp message to M-Pesa payment</h1>
        <p className="text-muted-foreground leading-relaxed">
          DukaBot connects your WhatsApp Business line, product catalog, and M-Pesa account
          into a single automated sales flow. Here's exactly how.
        </p>
      </div>

      <div className="relative space-y-4">
        {STEPS.map((step, i) => (
          <Card key={step.n} className="relative overflow-hidden">
            <CardContent className="pt-5 flex gap-5">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {step.n}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-border min-h-8" />
                )}
              </div>
              <div className="pb-2">
                <h3 className="text-sm font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{step.desc}</p>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.detail}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-5">
          <p className="text-sm font-semibold mb-1">Ready to start?</p>
          <p className="text-xs opacity-75">
            Go to Settings → connect your WhatsApp and M-Pesa, upload a catalog, and DukaBot
            starts selling within minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
