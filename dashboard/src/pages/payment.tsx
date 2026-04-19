import { useState } from 'react'
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

type Method = 'card' | 'mpesa'

// ── Shared invoice calculations ───────────────────────────────────────────────
function useInvoice(plan: PaymentPlan) {
  const subtotal = plan.billing === 'yearly' ? plan.price * 12 : plan.price
  const tax      = Math.round(subtotal * 0.16)
  const discount = plan.billing === 'yearly' ? Math.round(subtotal * 0.2) : 0
  const total    = subtotal + tax - discount
  return { subtotal, tax, discount, total }
}

// ── Credit card visual ────────────────────────────────────────────────────────
function CardVisual({ number, holder, expiry }: { number: string; holder: string; expiry: string }) {
  const raw    = number.replace(/\s/g, '')
  const masked = raw.replace(/\d(?=\d{4})/g, '•').padEnd(16, '•').replace(/(.{4})/g, '$1 ').trim()

  return (
    <div className="w-full rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 40%, #00acc1 100%)',
        minHeight: 158,
        boxShadow: '0 12px 40px rgba(26,115,232,0.4)',
      }}>
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 -left-4 w-40 h-40 rounded-full bg-white/10" />
      <span className="absolute top-4 right-4 text-white font-black text-lg italic opacity-90">VISA</span>

      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-white/60 text-[9px] uppercase tracking-widest">CARD/BANK</p>
          <p className="text-white text-xs font-mono tracking-widest mt-0.5">{masked}</p>
        </div>
        <svg width="34" height="26" viewBox="0 0 36 28" fill="none" className="opacity-80 mt-1">
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
          <p className="text-white text-sm font-semibold uppercase truncate max-w-[160px]">{holder || 'YOUR NAME'}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-[9px] uppercase tracking-widest">Expire Date</p>
          <p className="text-white text-sm font-semibold">{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  )
}

// ── M-Pesa visual banner ──────────────────────────────────────────────────────
function MpesaBanner({ phone }: { phone: string }) {
  return (
    <div className="w-full rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #00a651 0%, #007a3d 50%, #005c2e 100%)',
        minHeight: 140,
        boxShadow: '0 12px 40px rgba(0,166,81,0.4)',
      }}>
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-4 w-32 h-32 rounded-full bg-white/10" />

      {/* M-Pesa logo text */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
          <span className="text-green-700 font-black text-xs">M</span>
        </div>
        <div>
          <p className="text-white font-black text-lg leading-none tracking-tight">M-PESA</p>
          <p className="text-green-200 text-[9px] uppercase tracking-widest">Safaricom · Lipa Na M-Pesa</p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-white/60 text-[9px] uppercase tracking-widest">Phone Number</p>
          <p className="text-white text-sm font-semibold font-mono mt-0.5">{phone || '+254 7•• ••• •••'}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-[9px] uppercase tracking-widest">Network</p>
          <p className="text-white text-sm font-semibold">Safaricom</p>
        </div>
      </div>
    </div>
  )
}

// ── Steps indicator ───────────────────────────────────────────────────────────
function Steps({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            s < step  ? 'bg-green-500 text-white' :
            s === step ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-400'
          }`}>
            {s < step ? '✓' : s}
          </div>
          {s < total && (
            <div className={`w-7 h-0.5 rounded-full transition-all duration-500 ${s < step ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-800'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Form input ────────────────────────────────────────────────────────────────
function FormInput({ placeholder, value, onChange, icon, type = 'text', maxLength }: {
  placeholder: string; value: string; onChange: (v: string) => void
  icon?: React.ReactNode; type?: string; maxLength?: number
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
      {icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
    </div>
  )
}

// ── Orange CTA button ─────────────────────────────────────────────────────────
function OrangeButton({ label, onClick, disabled = false }: {
  label: string; onClick: () => void; disabled?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3.5 rounded-xl text-white font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-all disabled:cursor-not-allowed"
      style={{
        background: disabled
          ? 'rgba(251,146,60,0.45)'
          : 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
        boxShadow: disabled ? 'none' : '0 8px 24px rgba(249,115,22,0.38)',
      }}>
      {label}
    </button>
  )
}

// ── Green M-Pesa CTA button ───────────────────────────────────────────────────
function GreenButton({ label, onClick, disabled = false }: {
  label: string; onClick: () => void; disabled?: boolean
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-3.5 rounded-xl text-white font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-all disabled:cursor-not-allowed"
      style={{
        background: disabled
          ? 'rgba(0,166,81,0.4)'
          : 'linear-gradient(135deg, #00a651 0%, #007a3d 100%)',
        boxShadow: disabled ? 'none' : '0 8px 24px rgba(0,166,81,0.38)',
      }}>
      {label}
    </button>
  )
}

// ── Invoice breakdown ─────────────────────────────────────────────────────────
function InvoiceBreakdown({ plan, invoice }: { plan: PaymentPlan; invoice: ReturnType<typeof useInvoice> }) {
  const { subtotal, tax, discount, total } = invoice
  return (
    <div className="space-y-3">
      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Payment Details</p>
      {[
        { label: `DukaBot ${plan.name} plan`, value: `KES ${subtotal.toLocaleString()}` },
        { label: 'VAT (16%)',                 value: `KES ${tax.toLocaleString()}` },
        ...(discount > 0 ? [{ label: 'Yearly discount (20%)', value: `−KES ${discount.toLocaleString()}` }] : []),
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <span className={`text-sm font-medium ${value.startsWith('−') ? 'text-green-600' : 'text-gray-800 dark:text-gray-200'}`}>{value}</span>
        </div>
      ))}
      <div className="h-px bg-gray-100 dark:bg-gray-800" />
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900 dark:text-white">Total</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">KES {total.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ── Success screen (shared) ───────────────────────────────────────────────────
function SuccessScreen({ plan, invoice, lastFour, method, onDone }: {
  plan: PaymentPlan
  invoice: ReturnType<typeof useInvoice>
  lastFour?: string
  method: Method
  onDone: () => void
}) {
  const via = method === 'mpesa'
    ? 'M-Pesa STK Push'
    : `Visa card ending in ${lastFour}`

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
    >
      <Steps step={method === 'mpesa' ? 4 : 3} total={method === 'mpesa' ? 3 : 3} />

      <div className="px-5 pb-10 pt-2 flex flex-col items-center text-center gap-5">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center"
          style={{ boxShadow: '0 0 40px rgba(34,197,94,0.25)' }}
        >
          <motion.svg width="44" height="44" viewBox="0 0 44 44" fill="none">
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

        <div className="space-y-1.5 w-full px-4">
          {[80, 60, 70, 50].map((w, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5 + i * 0.07, duration: 0.3 }}
              className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 origin-left"
              style={{ width: `${w}%`, margin: '0 auto' }}
            />
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Done!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
            Your DukaBot <strong>{plan.name}</strong> plan is now active.{' '}
            KES {invoice.total.toLocaleString()} was paid via {via}.
            A receipt has been sent to your registered email.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="w-full space-y-2.5">
          <button onClick={onDone}
            className="w-full py-3.5 rounded-xl text-white text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98]"
            style={{ background: '#1a1a1a' }}>
            Back to Home
          </button>
          <button onClick={() => alert('Receipt download coming soon.')}
            className="w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            Download Receipt
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN PAYMENT PAGE
// ════════════════════════════════════════════════════════════════════════════
export function PaymentPage({ plan, onDone }: Props) {
  const invoice = useInvoice(plan)

  // payment method selector
  const [method, setMethod] = useState<Method>('mpesa')

  // card state
  const [cardStep, setCardStep]   = useState<1 | 2 | 3>(1)
  const [holder, setHolder]       = useState('')
  const [cardNum, setCardNum]     = useState('')
  const [expiry, setExpiry]       = useState('')
  const [cvc, setCvc]             = useState('')
  const [saveCard, setSaveCard]   = useState(false)
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({})
  const [paying, setPaying]       = useState(false)

  // mpesa state
  const [mpesaStep, setMpesaStep] = useState<1 | 2 | 3>(1)
  const [phone, setPhone]         = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [stkSent, setStkSent]     = useState(false)
  const [mpesaDone, setMpesaDone] = useState(false)
  const [confirmTimer, setConfirmTimer] = useState(0)

  const isDone = (method === 'card' && cardStep === 3) || (method === 'mpesa' && mpesaDone)

  // ── Card helpers ──────────────────────────────────────────────────────────
  function handleCardNum(raw: string) {
    const d = raw.replace(/\D/g, '').slice(0, 16)
    setCardNum(d.replace(/(.{4})/g, '$1 ').trim())
  }
  function handleExpiry(raw: string) {
    const d = raw.replace(/\D/g, '').slice(0, 4)
    setExpiry(d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d)
  }
  function validateCard() {
    const e: Record<string, string> = {}
    if (!holder.trim())                                         e.holder  = 'Card holder name required'
    if (cardNum.replace(/\s/g,'').length < 16)                 e.cardNum = 'Enter a valid 16-digit number'
    if (!expiry.includes('/') || expiry.length < 5)            e.expiry  = 'Enter MM/YY'
    if (cvc.length < 3)                                        e.cvc     = 'Enter 3-digit CVC'
    setCardErrors(e)
    return Object.keys(e).length === 0
  }
  function handleAddCard() {
    if (!validateCard()) return
    setCardStep(2)
  }
  function handleCardPay() {
    setPaying(true)
    setTimeout(() => { setPaying(false); setCardStep(3) }, 1800)
  }

  // ── M-Pesa helpers ────────────────────────────────────────────────────────
  function formatPhone(raw: string) {
    const d = raw.replace(/\D/g,'').slice(0, 12)
    setPhone(d)
  }
  function validatePhone() {
    const d = phone.replace(/\D/g,'')
    if (d.length < 9) { setPhoneError('Enter a valid Safaricom number'); return false }
    setPhoneError('')
    return true
  }
  function displayPhone() {
    const d = phone.replace(/\D/g,'')
    if (d.startsWith('0') && d.length >= 10) return '+254 ' + d.slice(1, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7)
    if (d.startsWith('254') && d.length >= 12) return '+' + d.slice(0,3) + ' ' + d.slice(3,6) + ' ' + d.slice(6,9) + ' ' + d.slice(9)
    if (d.startsWith('7') && d.length >= 9) return '+254 ' + d.slice(0,3) + ' ' + d.slice(3,6) + ' ' + d.slice(6)
    return phone
  }
  function handleSendStk() {
    if (!validatePhone()) return
    setStkSent(true)
    setMpesaStep(2)
    // Simulate real STK push countdown
    let t = 60
    setConfirmTimer(t)
    const iv = setInterval(() => {
      t -= 1
      setConfirmTimer(t)
      if (t <= 0) clearInterval(iv)
    }, 1000)
  }
  function handleMpesaConfirm() {
    setPaying(true)
    setTimeout(() => { setPaying(false); setMpesaDone(true); setMpesaStep(3) }, 1400)
  }

  // ── Method toggle labels ──────────────────────────────────────────────────
  const methodButtons: { id: Method; label: string; icon: React.ReactNode }[] = [
    {
      id: 'mpesa',
      label: 'M-Pesa',
      icon: (
        <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-white font-black text-[9px]">M</span>
        </div>
      ),
    },
    {
      id: 'card',
      label: 'Card',
      icon: (
        <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
          <rect x="1" y="1" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M1 6h22" stroke="currentColor" strokeWidth="1.8"/>
          <rect x="4" y="10" width="5" height="3" rx="1" fill="currentColor"/>
        </svg>
      ),
    },
  ]

  // ── Shared back button ────────────────────────────────────────────────────
  function BackBtn({ onClick }: { onClick: () => void }) {
    return (
      <button onClick={onClick} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13 16l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <AnimatePresence mode="wait">

          {/* ══════════════════════════════════════════════════
              SUCCESS — shared for both methods
          ══════════════════════════════════════════════════ */}
          {isDone && (
            <SuccessScreen
              plan={plan}
              invoice={invoice}
              lastFour={cardNum.replace(/\s/g,'').slice(-4)}
              method={method}
              onDone={onDone}
            />
          )}

          {/* ══════════════════════════════════════════════════
              M-PESA FLOW
          ══════════════════════════════════════════════════ */}

          {/* M-Pesa Step 1 — Enter number */}
          {!isDone && method === 'mpesa' && mpesaStep === 1 && (
            <motion.div key="mpesa-1"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-1">
                <BackBtn onClick={onDone} />
                <h1 className="text-base font-bold text-gray-900 dark:text-white">Pay with M-Pesa</h1>
              </div>
              <Steps step={1} total={3} />

              <div className="px-5 pb-7 space-y-5">
                <MpesaBanner phone={displayPhone()} />

                {/* Method selector */}
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {methodButtons.map(({ id, label, icon }) => (
                    <button key={id} onClick={() => setMethod(id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                        method === id
                          ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}>
                      {icon}{label}
                    </button>
                  ))}
                </div>

                {/* Plan info */}
                <div className="rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 px-4 py-3 text-center">
                  <p className="text-xs text-green-700 dark:text-green-400 font-medium">DukaBot {plan.name} Plan</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-300 mt-0.5">KES {invoice.total.toLocaleString()}</p>
                  <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">incl. 16% VAT · per {plan.billing === 'monthly' ? 'month' : 'year'}</p>
                </div>

                {/* Phone number input */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Safaricom M-Pesa Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">🇰🇪</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => formatPhone(e.target.value)}
                      placeholder="0712 345 678"
                      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400/40 focus:border-green-500 transition-all font-mono"
                    />
                  </div>
                  {phoneError && <p className="text-red-500 text-xs pl-1">{phoneError}</p>}
                  <p className="text-xs text-gray-400 pl-1">You will receive an STK Push prompt on this number.</p>
                </div>

                <GreenButton label="Send STK Push" onClick={handleSendStk} />
              </div>
            </motion.div>
          )}

          {/* M-Pesa Step 2 — STK Push sent, waiting for PIN */}
          {!isDone && method === 'mpesa' && mpesaStep === 2 && (
            <motion.div key="mpesa-2"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-1">
                <BackBtn onClick={() => { setMpesaStep(1); setStkSent(false) }} />
                <h1 className="text-base font-bold text-gray-900 dark:text-white">M-Pesa Payment</h1>
              </div>
              <Steps step={2} total={3} />

              <div className="px-5 pb-7 space-y-5">
                {/* STK push animation */}
                <div className="rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-5 flex flex-col items-center gap-3 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center"
                    style={{ boxShadow: '0 0 0 0 rgba(34,197,94,0.5)' }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z" stroke="white" strokeWidth="2" fill="white" fillOpacity=".25"/>
                      <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                  </motion.div>

                  <div>
                    <p className="text-sm font-bold text-green-800 dark:text-green-300">STK Push Sent!</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5 leading-relaxed">
                      Check your phone <strong className="font-mono">{displayPhone()}</strong> for the M-Pesa prompt. Enter your M-Pesa PIN to complete payment.
                    </p>
                  </div>

                  {/* Countdown */}
                  {confirmTimer > 0 && (
                    <div className="text-xs text-green-700 dark:text-green-400 font-medium">
                      Prompt expires in <span className="font-mono font-bold">{confirmTimer}s</span>
                    </div>
                  )}
                </div>

                <InvoiceBreakdown plan={plan} invoice={invoice} />

                <div className="h-px bg-gray-100 dark:bg-gray-800" />

                {/* "I've entered my PIN" */}
                <div className="space-y-2">
                  <GreenButton
                    label={paying ? 'Confirming…' : "I've Entered My PIN"}
                    onClick={handleMpesaConfirm}
                    disabled={paying}
                  />
                  <button
                    onClick={handleSendStk}
                    className="w-full py-2.5 text-xs text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors underline underline-offset-2"
                  >
                    Didn't receive it? Resend STK Push
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ══════════════════════════════════════════════════
              CARD FLOW
          ══════════════════════════════════════════════════ */}

          {/* Card Step 1 — Add card details */}
          {!isDone && method === 'card' && cardStep === 1 && (
            <motion.div key="card-1"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-1">
                <BackBtn onClick={onDone} />
                <h1 className="text-base font-bold text-gray-900 dark:text-white">Add Card</h1>
              </div>
              <Steps step={1} total={3} />

              <div className="px-5 pb-7 space-y-5">
                <CardVisual number={cardNum.replace(/\s/g,'')} holder={holder} expiry={expiry} />

                {/* Method selector */}
                <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                  {methodButtons.map(({ id, label, icon }) => (
                    <button key={id} onClick={() => setMethod(id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                        method === id
                          ? 'bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white'
                          : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}>
                      {icon}{label}
                    </button>
                  ))}
                </div>

                {/* Plan badge */}
                <div className="text-center">
                  <span className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                    DukaBot {plan.name} · KES {plan.price.toLocaleString()}/{plan.billing === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>

                {/* Form */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Card Details</p>

                  <div>
                    <FormInput placeholder="Account Name" value={holder} onChange={setHolder}
                      icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12Zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8Z" fill="currentColor"/></svg>}
                    />
                    {cardErrors.holder && <p className="text-red-500 text-xs mt-1 pl-1">{cardErrors.holder}</p>}
                  </div>

                  <div>
                    <FormInput placeholder="Card Number" value={cardNum} onChange={handleCardNum} maxLength={19}
                      icon={<svg width="16" height="16" viewBox="0 0 24 18" fill="none"><rect x="1" y="1" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M1 6h22" stroke="currentColor" strokeWidth="1.8"/><rect x="4" y="10" width="5" height="3" rx="1" fill="currentColor"/></svg>}
                    />
                    {cardErrors.cardNum && <p className="text-red-500 text-xs mt-1 pl-1">{cardErrors.cardNum}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FormInput placeholder="MM/YY" value={expiry} onChange={handleExpiry} maxLength={5} />
                      {cardErrors.expiry && <p className="text-red-500 text-xs mt-1 pl-1">{cardErrors.expiry}</p>}
                    </div>
                    <div>
                      <FormInput placeholder="CVC" value={cvc} onChange={v => setCvc(v.replace(/\D/g,'').slice(0,3))} type="password" maxLength={3} />
                      {cardErrors.cvc && <p className="text-red-500 text-xs mt-1 pl-1">{cardErrors.cvc}</p>}
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <div onClick={() => setSaveCard(v => !v)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${saveCard ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-gray-600'}`}>
                    {saveCard && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Save Card for Later</span>
                </label>

                <OrangeButton label="Add Card" onClick={handleAddCard} />
              </div>
            </motion.div>
          )}

          {/* Card Step 2 — Payment review */}
          {!isDone && method === 'card' && cardStep === 2 && (
            <motion.div key="card-2"
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-5 pt-5 pb-1">
                <BackBtn onClick={() => setCardStep(1)} />
                <h1 className="text-base font-bold text-gray-900 dark:text-white">Payment</h1>
              </div>
              <Steps step={2} total={3} />

              <div className="px-5 pb-7 space-y-5">
                {/* Masked card preview */}
                <div className="w-full rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 40%, #00acc1 100%)', minHeight: 148, boxShadow: '0 12px 40px rgba(26,115,232,0.4)' }}>
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
                  <span className="absolute top-4 right-4 text-white font-black text-lg italic opacity-90">VISA</span>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white/60 text-[9px] uppercase tracking-widest">CARD/BANK</p>
                      <p className="text-white text-xs font-mono tracking-widest mt-0.5">
                        {cardNum.slice(0,4)} •••• •••• {cardNum.replace(/\s/g,'').slice(12) || '••••'}
                      </p>
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
                </div>

                <InvoiceBreakdown plan={plan} invoice={invoice} />

                <button onClick={() => alert('Invoice download coming soon.')}
                  className="w-full text-sm text-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 underline underline-offset-2">
                  Download Invoice
                </button>

                <OrangeButton label={paying ? 'Processing…' : 'Pay Now'} onClick={handleCardPay} disabled={paying} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
