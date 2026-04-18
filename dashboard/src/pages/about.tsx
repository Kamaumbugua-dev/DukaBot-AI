import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BotIcon, ShieldIcon, HeartCheckIcon, ChartIncreaseIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const VALUES = [
  { icon: BotIcon,            title: 'AI-First',         desc: 'Every interaction is powered by Claude — the most capable conversational AI — trained to sell in Kenglish the way Nairobi merchants actually speak.' },
  { icon: HeartCheckIcon,     title: 'Merchant-Centric', desc: 'We built DukaBot because we saw small shop owners losing sales at midnight when they were asleep. Every feature exists to serve you, not us.' },
  { icon: ShieldIcon,         title: 'Trustworthy',      desc: 'M-Pesa is sacred to Kenyan commerce. DukaBot never touches your Daraja credentials directly — all payments are processed through Safaricom\'s official API.' },
  { icon: ChartIncreaseIcon,  title: 'Always Improving', desc: 'We ship improvements every week based on real merchant feedback. If DukaBot makes a mistake, we fix it — and the whole fleet gets smarter.' },
]

const TEAM = [
  { name: 'Stephen Kamau',  role: 'Founder & CEO',        bio: 'Built his first chatbot at 19. Spent 3 years in Safaricom\'s fintech division before starting DukaBot.', initials: 'SK' },
  { name: 'Aisha Omondi',   role: 'Head of AI',           bio: 'MSc Machine Learning, University of Nairobi. Architected the Kenglish understanding layer that sets DukaBot apart.', initials: 'AO' },
  { name: 'Brian Mutua',    role: 'Lead Engineer',         bio: 'Previously at Andela. Owns the WhatsApp Cloud API integration and M-Pesa Daraja pipeline.', initials: 'BM' },
  { name: 'Grace Wambui',   role: 'Merchant Success',     bio: 'Onboarded the first 200 merchants personally. Knows every pain point by heart.', initials: 'GW' },
]

export function AboutPage() {
  return (
    <div className="space-y-10 max-w-3xl">

      {/* Hero */}
      <div className="space-y-3">
        <Badge variant="secondary">About DukaBot AI</Badge>
        <h1 className="text-3xl font-bold tracking-tight">
          Selling on WhatsApp, <br className="hidden sm:block" />powered by AI
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          DukaBot AI was born from a simple observation: Kenyan SMEs do most of their
          commerce through WhatsApp, yet they answer every message manually — at 2 AM,
          between chores, mid-prayer. We built the AI sales agent that never sleeps,
          never misses a customer, and speaks the language of the streets.
        </p>
      </div>

      {/* Mission */}
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            To give every Kenyan small business — from a Gikomba stall to a Westlands
            boutique — the same 24/7 sales firepower that large retailers spend millions
            to build. DukaBot levels the field: you set up your catalog once, connect
            your WhatsApp, and the AI handles the rest.
          </p>
        </CardContent>
      </Card>

      {/* Values */}
      <div>
        <h2 className="text-lg font-semibold mb-4">What we stand for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VALUES.map(({ icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="pt-5 flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <HugeiconsIcon icon={icon} size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">{title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-lg font-semibold mb-4">The team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TEAM.map((m) => (
            <Card key={m.name}>
              <CardContent className="pt-5 flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {m.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{m.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 mb-2">{m.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Founded */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex flex-wrap gap-8 text-center">
            {[
              { label: 'Founded',    value: '2024' },
              { label: 'Merchants',  value: '400+' },
              { label: 'Chats / mo', value: '120k+' },
              { label: 'HQ',         value: 'Nairobi, Kenya' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
