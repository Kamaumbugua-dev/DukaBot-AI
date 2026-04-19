import { useState } from 'react'
import { Badge } from '@/components/ui/badge'

type Tab = 'privacy' | 'terms' | 'cookies' | 'refunds'
const TABS: { id: Tab; label: string }[] = [
  { id: 'privacy',  label: 'Privacy Policy' },
  { id: 'terms',    label: 'Terms of Service' },
  { id: 'cookies',  label: 'Cookie Policy' },
  { id: 'refunds',  label: 'Refund Policy' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </div>
  )
}

export function LegalPage() {
  const [tab, setTab] = useState<Tab>('privacy')

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Badge variant="secondary">Legal</Badge>
        <h1 className="text-3xl font-bold tracking-tight">Legal Documents</h1>
        <p className="text-muted-foreground text-sm">Last updated: April 2026 · DukaBot AI Ltd, Nairobi, Kenya</p>
      </div>

      <div className="flex gap-2 border-b flex-wrap">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'privacy' && (
        <div className="space-y-6">
          <Section title="What data we collect">
            <p>We collect information you provide when you create a merchant account: your name, business name, WhatsApp number, email address, and M-Pesa Paybill or Till details.</p>
            <p>We also collect data generated through the platform: customer conversations (anonymised), order records, payment confirmations from Safaricom Daraja, and dashboard usage analytics.</p>
          </Section>
          <Section title="How we use your data">
            <p>Your data is used solely to operate the DukaBot AI service — powering the AI sales agent, processing M-Pesa payments, and displaying your analytics dashboard.</p>
            <p>We do not sell your data or your customers' data to any third party. Full stop.</p>
          </Section>
          <Section title="Data storage & security">
            <p>All data is stored on encrypted servers hosted in the EU (Railway.app / AWS Frankfurt region). Database connections use TLS 1.3. M-Pesa credentials are stored in environment-level secrets — never in application code or logs.</p>
          </Section>
          <Section title="Your rights">
            <p>You may request a full export of your data at any time. You may also request permanent deletion of your account and all associated data within 30 days of the request. Contact us at privacy@dukabot.ai.</p>
          </Section>
          <Section title="Contact">
            <p>DukaBot AI Ltd · P.O. Box 12345, Nairobi 00100, Kenya · privacy@dukabot.ai</p>
          </Section>
        </div>
      )}

      {tab === 'terms' && (
        <div className="space-y-6">
          <Section title="Acceptance">
            <p>By creating a DukaBot AI merchant account, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
          </Section>
          <Section title="Permitted use">
            <p>DukaBot AI may only be used for lawful commerce. You may not use it to sell counterfeit goods, engage in fraud, spam customers, or violate Safaricom's acceptable use policy for M-Pesa.</p>
          </Section>
          <Section title="Your responsibilities">
            <p>You are responsible for the accuracy of your product catalog, the legality of goods you sell, and your compliance with Kenya Revenue Authority tax obligations. DukaBot AI is a tool — the business decisions are yours.</p>
          </Section>
          <Section title="Service availability">
            <p>We target 99.9% uptime but do not guarantee it. Planned maintenance is announced 48 hours in advance. We are not liable for losses arising from WhatsApp Cloud API or Safaricom Daraja outages beyond our control.</p>
          </Section>
          <Section title="Termination">
            <p>Either party may terminate the agreement with 30 days' written notice. We may terminate immediately for material breach (fraud, abuse, non-payment).</p>
          </Section>
        </div>
      )}

      {tab === 'cookies' && (
        <div className="space-y-6">
          <Section title="What are cookies">
            <p>Cookies are small text files stored in your browser. The DukaBot merchant dashboard uses a minimal set of cookies necessary to function.</p>
          </Section>
          <Section title="Cookies we use">
            <p><strong>Session cookie</strong> — keeps you logged in during your dashboard session. Expires when you close the browser.</p>
            <p><strong>Preference cookie</strong> — remembers your theme (light/dark) and sidebar state. Expires after 1 year.</p>
            <p><strong>Analytics cookie</strong> — anonymous usage analytics (page views, feature usage). We use a self-hosted Plausible instance — no Google, no Meta pixels.</p>
          </Section>
          <Section title="Your choices">
            <p>You can disable cookies in your browser settings. Note that disabling session cookies will prevent you from staying logged in. We do not use advertising or tracking cookies.</p>
          </Section>
        </div>
      )}

      {tab === 'refunds' && (
        <div className="space-y-6">
          <Section title="General refund policy">
            <p>All subscription fees paid to DukaBot AI are <strong>non-refundable</strong> except where expressly stated below. By subscribing to any DukaBot AI plan, you acknowledge and agree to this policy.</p>
          </Section>
          <Section title="Eligibility for a refund">
            <p>A refund may be considered <strong>only</strong> if all of the following conditions are met:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>The request is made within <strong>48 hours</strong> of the initial subscription payment on a brand-new account.</li>
              <li>Fewer than <strong>10 customer conversations</strong> have been handled by DukaBot on the account.</li>
              <li>No M-Pesa STK Push transactions have been initiated through the platform.</li>
              <li>A written refund request is submitted to support@axonlattice.dev with full account details.</li>
            </ul>
            <p>Refund requests that do not satisfy all conditions above will be automatically declined.</p>
          </Section>
          <Section title="No pro-rated refunds">
            <p>DukaBot AI does not issue partial or pro-rated refunds for any reason, including but not limited to: early cancellation, downgrading plans, unused days in a billing period, or dissatisfaction with AI output quality.</p>
            <p>Upon cancellation, access continues until the end of the current billing period. No credit or refund is issued for the remaining period.</p>
          </Section>
          <Section title="Plan upgrades and changes">
            <p>Payments made for plan upgrades are non-refundable. When you upgrade mid-cycle, you are charged the difference immediately and that amount is final.</p>
          </Section>
          <Section title="How to submit a request">
            <p>Email <strong>support@axonlattice.dev</strong> with the subject line <em>"Refund Request — [Your Account Email]"</em>. Include your merchant account email, the date of payment, and the reason for the request. We review eligible requests within 7 business days. Approved refunds are processed via M-Pesa or bank transfer within 21 days.</p>
          </Section>
          <Section title="DukaBot AI platform errors">
            <p>If a verified technical fault on DukaBot AI's infrastructure directly causes a double-charge or failed STK Push that results in a customer being debited without a corresponding order being created, DukaBot AI will issue an account credit (not a cash refund) equal to the transaction amount within 14 days of a confirmed report. This is the sole exception to the no-refund policy and applies only to verified platform-side errors, not issues arising from the merchant's WhatsApp number, Safaricom network, or customer device.</p>
          </Section>
          <Section title="Chargebacks">
            <p>Initiating a chargeback or payment dispute without first contacting DukaBot AI support constitutes a breach of these Terms. DukaBot AI reserves the right to immediately suspend the account, pursue recovery of disputed amounts, and permanently ban the merchant from future use of the platform.</p>
          </Section>
        </div>
      )}
    </div>
  )
}
