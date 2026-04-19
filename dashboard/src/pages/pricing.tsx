import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import NumberFlow from '@number-flow/react'
import {
  Tick02Icon,
  CheckmarkCircle02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Perfect for small shops getting started',
    description: 'small shop',
    monthlyPrice: 1499,
    yearlyPrice: 999,
    badge: null,
    features: [
      'Up to 200 WhatsApp chats/month',
      'Product catalog (50 items)',
      'M-Pesa STK push payments',
      'Basic analytics dashboard',
      'Email support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'For businesses ready to scale',
    description: 'growing business',
    monthlyPrice: 3999,
    yearlyPrice: 2999,
    badge: 'Most Popular',
    features: [
      'Up to 1,000 WhatsApp chats/month',
      'Unlimited catalog items',
      'M-Pesa + analytics dashboard',
      'Customer segmentation',
      'Priority email & chat support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Enterprise-grade for high-volume merchants',
    description: 'enterprise',
    monthlyPrice: 8999,
    yearlyPrice: 6999,
    badge: 'Best Value',
    features: [
      'Unlimited WhatsApp chats',
      'Multi-agent support',
      'Priority support + custom AI tone',
      'Custom integrations & API access',
      'Dedicated account manager',
    ],
  },
]

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
}

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [purchasing, setPurchasing] = useState<string | null>(null)

  function handleBuyNow(planId: string, planName: string, price: number) {
    setPurchasing(planId)
    // Simulate purchase flow — replace with real payment integration
    setTimeout(() => {
      setPurchasing(null)
      alert(`Redirecting to checkout for ${planName} plan @ KES ${price.toLocaleString()}/${billingCycle === 'monthly' ? 'mo' : 'yr'}`)
    }, 800)
  }

  return (
    <div className="space-y-10 max-w-5xl">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="text-muted-foreground text-base">
          Choose the plan that fits your business. All plans include M-Pesa payments, WhatsApp AI, and a merchant dashboard. No hidden fees.
        </p>

        {/* Billing toggle */}
        <div className="flex justify-center mt-6">
          <div className="bg-muted p-1 h-10 rounded-xl ring-1 ring-border flex w-64">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 h-full rounded-lg text-sm font-medium relative transition-colors duration-300 ${
                billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div
                  layoutId="pricing-tab-bg"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm ring-1 ring-border"
                  transition={TRANSITION}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 h-full rounded-lg text-sm font-medium relative transition-colors duration-300 flex items-center justify-center gap-1.5 ${
                billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {billingCycle === 'yearly' && (
                <motion.div
                  layoutId="pricing-tab-bg"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm ring-1 ring-border"
                  transition={TRANSITION}
                />
              )}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase text-primary-foreground tracking-tight whitespace-nowrap">
                20% OFF
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
          const isGrowth = plan.id === 'growth'
          const isBuying = purchasing === plan.id

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col rounded-2xl border bg-card transition-shadow duration-300 hover:shadow-lg ${
                isGrowth ? 'border-primary border-2 shadow-md' : 'border-border'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    isGrowth
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-foreground text-background'
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col gap-5 flex-1">
                {/* Plan name + price */}
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground">{plan.tagline}</p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-medium text-muted-foreground">KES</span>
                    <span className="text-4xl font-bold text-foreground">
                      <NumberFlow value={price} format={{ style: 'decimal' }} />
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    per {billingCycle === 'monthly' ? 'month' : 'year'}
                    {billingCycle === 'yearly' && (
                      <span className="ml-1.5 text-primary font-medium">
                        — save KES {((plan.monthlyPrice * 12) - (plan.yearlyPrice * 12)).toLocaleString()}
                      </span>
                    )}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-col gap-2.5 flex-1">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        size={15}
                        className="text-primary mt-0.5 shrink-0"
                      />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Buy Now button */}
                <button
                  onClick={() => handleBuyNow(plan.id, plan.name, price)}
                  disabled={isBuying}
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isGrowth
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-foreground text-background hover:opacity-85'
                  } ${isBuying ? 'opacity-60 cursor-wait' : ''}`}
                >
                  {isBuying ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
                      Buy Now — KES <NumberFlow value={price} format={{ style: 'decimal' }} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Bottom note */}
      <p className="text-center text-xs text-muted-foreground">
        All plans include a 14-day free trial. Cancel anytime. Payments processed via M-Pesa &amp; card.
        Need a custom plan?{' '}
        <a href="mailto:support@axonlattice.dev" className="text-primary underline underline-offset-2">
          Contact us
        </a>
      </p>
    </div>
  )
}
