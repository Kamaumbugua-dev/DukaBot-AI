import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export interface PaymentPlan {
  name: string
  price: number
  billing: 'monthly' | 'yearly'
}

interface Props {
  plan: PaymentPlan
  onDone: () => void
}

// ── Card visual ─────────────────────────────────────────────────────────────
function CardVisual({
  number, holder, expiry, flipped = false,
}: {
  number: string; holder: string; expiry: string; flipped?: boolean
}) {
  const masked = number.replace(/\d(?=\d{4})/g, '•').padEnd(19, '•').replace(/(.{4})/g, '$1 ').trim()

  return (
    <div
      className="w-full rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 40%, #00acc1 100%)',
        minHeight: 160,
        boxShadow: '0 12px 40px rgba(26,115,232,0.45)',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: 'white' }} />
      <div className="absolute -bottom-12 -left-4 w-40 h-40 rounded-full opacity-10" style={{ background: 'white' }} />

      {/* Top row */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">CARD/BANK</p>
          <p className="text-white text-xs font-medium mt-0.5 tracking-widest">
            {number
              ? masked
              : '•••• •••• •••• ••••'}
          </p>
        </div>
        {/* Chip */}
        <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="opacity-80">
          <rect x="1" y="1" width="34" height="26" rx="5" stroke="white" strokeWidth="1.5"/>
          <line x1="1" y1="10" x2="35" y2="10" stroke="white" strokeWidth="1.2"/>
          <line x1="1" y1="18" x2="35" y2="18" stroke="white" strokeWidth="1.2"/>
          <line x1="12" y1="1" x2="12" y2="27" stroke="white" strokeWidth="1.2"/>
          <line x1="24" y1="1" x2="24" y2="27" stroke="white" strokeWidth="1.2"/>
        </svg>
      </div>

      {/* Bottom row */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-white/60 text-[9px] uppercase tracking-widest">CARD HOLDER</p>
          <p className="text-white text-sm font-semibold mt-0.5 uppercase tracking-wide truncate max-w-[160px]">
            {holder || 'YOUR NAME'}
          </p>
        </div>
        <div className="text-right">
          {flipped ? (
            <div>
              <p className="text-white/60 text-[9px] uppercase tracking-widest">CVC</p>
              <p className="text-white text-sm font-semibold">•••</p>
            </div>
          ) : (
            <div>
              <p className="text-white/60 text-[9px] uppercase tracking-widest">Expire Date</p>
              <p className="text-white text-sm font-semibold">{expiry || 'MM/YY'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Visa-style logo */}
      <div className="absolute top-4 right-4">
        <span className="text-white font-black text-lg italic tracking-tight opacity-90">VISA</span>
      </div>
    </div>
  )
}

// ── Step indicator ───────────────────────────────────────────────────────────
function Steps({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            s < step  ? 'bg-green-500 text-white' :
            s === step ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-400'
          }`}>
            {s < step ? '✓' : s}
          </div>
          {s < 3 && (
            <div className={`w-8 h-0.5 rounded-full transition-all ${s < step ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-800'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Styled input ─────────────────────────────────────────────────────────────
function FormInput({
  label, placeholder, value, onChange, icon, type = 'text', maxLength,
}: {
  label?: string; placeholder: string; value: string
  onChange: (v: string) => void; icon?: React.ReactNode
  type?: string; maxLength?: number
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all pr-10"
      />
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  )
}

// ── Orange gradient button ───────────────────────────────────────────────────
function OrangeButton({ label, onClick, disabled = false }: {
  label: string; onClick: () => void; disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3.5 rounded-xl text-white font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: disabled
          ? 'rgba(251,146,60,0.5)'
          : 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
        boxShadow: disabled ? 'none' : '0 8px 24px rgba(249,115,22,0.4)',
      }}
    >
      {label}
    </button>
  )
}

// ── Main payment flow ────────────────────────────────────────────────────────
export function PaymentPage({ plan, onDone }: Props) {
  const [step, setStep]       = useState<1 | 2 | 3>(1)
  const [holder, setHolder]   = useState('')
  const [cardNum, setCardNum] = useState('')
  const [expiry, setExpiry]   = useState('')
  const [cvc, setCvc]         = useState('')
  const [saveCard, setSaveCard] = useState(false)
  const [paying, setPaying]   = useState(false)
  const [errors, setErrors]   = useState<Record<string, string>>({})

  // Calculate invoice amounts
  const tax      = Math.round(plan.price * 0.16)   // 16% VAT
  const discount = plan.billing === 'yearly' ? Math.round(plan.price * 0.2 * 12) : 0
  const subtotal = plan.billing === 'yearly' ? plan.price * 12 : plan.price
  const total    = subtotal + tax - discount

  // Format card number with spaces
  function handleCardNum(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 16)
    setCardNum(digits.replace(/(.{4})/g, '$1 ').trim())
  }

  // Format expiry MM/YY
  function handleExpiry(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) setExpiry(digits.slice(0, 2) + '/' + digits.slice(2))
    else setExpiry(digits)
  }

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!holder.trim()) e.holder = 'Card holder name required'
    if (cardNum.replace(/\s/g, '').length < 16) e.cardNum = 'Enter a valid 16-digit card number'
    if (!expiry.includes('/') || expiry.length < 5) e.expiry = 'Enter MM/YY'
    if (cvc.length < 3) e.cvc = 'Enter 3-digit CVC'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleAddCard() {
    if (!validateStep1()) return
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePayNow() {
    setPaying(true)
    setTimeout(() => { setPaying(false); setStep(3) }, 1800)
  }

  const displayCard = cardNum
    ? cardNum.slice(0, 4) + ' •••• •••• ' + (cardNum.replace(/\s/g,'').slice(12) || '••••')
    : '•••• •••• •••• ••••'

  return (
    <div className="min-h-screen bg-[#f5f0e8] dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">

          {/* ── Step 1: Add Card ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-1">
                <button onClick={onDone} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13 16l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h1 className="text-base font-bold text-gray-900 dark:text-white">Add Card</h1>
              </div>

              <Steps step={1} />

              <div className="px-5 pb-7 space-y-5">
                {/* Card visual */}
                <CardVisual number={cardNum.replace(/\s/g, '')} holder={holder} expiry={expiry} />

                {/* Plan badge */}
                <div className="text-center">
                  <span className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                    DukaBot {plan.name} · KES {plan.price.toLocaleString()}/{plan.billing === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>

                {/* Form */}
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">Card Details</p>

                  <div className="space-y-3">
                    <div>
                      <FormInput
                        placeholder="Account Name"
                        value={holder}
                        onChange={setHolder}
                        icon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12Zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8Z" fill="currentColor"/>
                          </svg>
                        }
                      />
                      {errors.holder && <p className="text-red-500 text-xs mt-1 pl-1">{errors.holder}</p>}
                    </div>

                    <div>
                      <FormInput
                        placeholder="Card Number"
                        value={cardNum}
                        onChange={handleCardNum}
                        maxLength={19}
                        icon={
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/>
                            <rect x="5" y="14" width="4" height="2" rx="0.5" fill="currentColor"/>
                          </svg>
                        }
                      />
                      {errors.cardNum && <p className="text-red-500 text-xs mt-1 pl-1">{errors.cardNum}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <FormInput
                          placeholder="Expire Date"
                          value={expiry}
                          onChange={handleExpiry}
                          maxLength={5}
                        />
                        {errors.expiry && <p className="text-red-500 text-xs mt-1 pl-1">{errors.expiry}</p>}
                      </div>
                      <div>
                        <FormInput
                          placeholder="CVC"
                          value={cvc}
                          onChange={v => setCvc(v.replace(/\D/g, '').slice(0, 3))}
                          type="password"
                          maxLength={3}
                        />
                        {errors.cvc && <p className="text-red-500 text-xs mt-1 pl-1">{errors.cvc}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save card checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div
                    onClick={() => setSaveCard(v => !v)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                      saveCard ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {saveCard && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Save Card for Later</span>
                </label>

                <OrangeButton label="Add Card" onClick={handleAddCard} />
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Payment Details ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-1">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M13 16l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h1 className="text-base font-bold text-gray-900 dark:text-white">Payment</h1>
              </div>

              <Steps step={2} />

              <div className="px-5 pb-7 space-y-5">
                {/* Card preview — partially masked */}
                <div
                  className="w-full rounded-2xl p-5 relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 40%, #00acc1 100%)',
                    minHeight: 150,
                    boxShadow: '0 12px 40px rgba(26,115,232,0.45)',
                  }}
                >
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 bg-white" />
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/60 text-[9px] uppercase tracking-widest">CARD/BANK</p>
                      <p className="text-white text-xs font-mono tracking-widest mt-0.5">{displayCard}</p>
                    </div>
                    <svg width="32" height="24" viewBox="0 0 36 28" fill="none" className="opacity-80">
                      <rect x="1" y="1" width="34" height="26" rx="5" stroke="white" strokeWidth="1.5"/>
                      <line x1="1" y1="10" x2="35" y2="10" stroke="white" strokeWidth="1.2"/>
                      <line x1="1" y1="18" x2="35" y2="18" stroke="white" strokeWidth="1.2"/>
                      <line x1="12" y1="1" x2="12" y2="27" stroke="white" strokeWidth="1.2"/>
                      <line x1="24" y1="1" x2="24" y2="27" stroke="white" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/60 text-[9px] uppercase tracking-widest">CARD HOLDER</p>
                      <p className="text-white text-sm font-semibold uppercase">{holder}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-[9px] uppercase tracking-widest">CVC</p>
                      <p className="text-white text-sm font-semibold">•••</p>
                    </div>
                  </div>
                  <span className="absolute top-4 right-4 text-white font-black text-lg italic opacity-90">VISA</span>
                </div>

                {/* Payment breakdown */}
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-4">Payment Details</p>

                  <div className="space-y-3">
                    {[
                      { label: 'DukaBot ' + plan.name + ' plan', value: `KES ${subtotal.toLocaleString()}` },
                      { label: 'VAT (16%)', value: `KES ${tax.toLocaleString()}` },
                      ...(discount > 0 ? [{ label: 'Yearly discount (20%)', value: `- KES ${discount.toLocaleString()}` }] : []),
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                        <span className={`text-sm font-medium ${value.startsWith('-') ? 'text-green-600' : 'text-gray-800 dark:text-gray-200'}`}>
                          {value}
                        </span>
                      </div>
                    ))}

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Download invoice link */}
                <button
                  onClick={() => alert('Invoice download coming soon.')}
                  className="w-full text-sm text-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 underline underline-offset-2"
                >
                  Download Invoice
                </button>

                <OrangeButton label={paying ? 'Processing…' : 'Pay Now'} onClick={handlePayNow} disabled={paying} />
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Payment Done ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              <Steps step={3} />

              <div className="px-5 pb-10 pt-2 flex flex-col items-center text-center gap-5">
                {/* Animated green check */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                  className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center"
                  style={{ boxShadow: '0 0 40px rgba(34,197,94,0.25)' }}
                >
                  <motion.svg
                    width="44" height="44" viewBox="0 0 44 44" fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <motion.path
                      d="M9 22l9 9 17-18"
                      stroke="#22c55e"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    />
                  </motion.svg>
                </motion.div>

                {/* Receipt lines decoration */}
                <div className="space-y-2 w-full px-4">
                  {[80, 60, 70, 50].map((w, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.3 }}
                      className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 origin-left"
                      style={{ width: `${w}%`, margin: '0 auto' }}
                    />
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Done!</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                    Your DukaBot <strong>{plan.name}</strong> plan is now active. KES {total.toLocaleString()} has been charged to your Visa card ending in {cardNum.replace(/\s/g,'').slice(-4)}.
                    A receipt has been sent to your registered email.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                  className="w-full space-y-2.5"
                >
                  <button
                    onClick={onDone}
                    className="w-full py-3.5 rounded-xl text-white text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
                    style={{ background: '#1a1a1a' }}
                  >
                    Back to Home
                  </button>
                  <button
                    onClick={() => alert('Receipt download coming soon.')}
                    className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Download Receipt
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
