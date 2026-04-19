import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Bot, MessageCircle, Smartphone, Package, BarChart3, Globe, Check } from 'lucide-react'

interface Props {
  onGetStarted: () => void
}

// ── animated counter ────────────────────────────────────────────────────────
function Counter({ to, prefix = '', suffix = '', duration = 1800 }: {
  to: number; prefix?: string; suffix?: string; duration?: number
}) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(ease * to))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to, duration])

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>
}

// ── fade-in wrapper ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── WhatsApp chat mockup ────────────────────────────────────────────────────
function ChatMockup() {
  const messages = [
    { from: 'customer', text: 'Habari! Je una Samsung TV?' },
    { from: 'bot', text: 'Habari! Ndiyo, tuna Samsung TV 43" kwa KES 45,000 na Samsung 55" kwa KES 78,000. Unataka kuona maelezo zaidi?' },
    { from: 'customer', text: 'Nipe ile 43" na niambie bei ya delivery Nairobi.' },
    { from: 'bot', text: '📦 Samsung TV 43" — KES 45,000\n🚚 Delivery Nairobi CBD: KES 500 (saa 24)\n\nJe utalipia kupitia M-Pesa?' },
    { from: 'customer', text: 'Ndio, lipa.' },
    { from: 'bot', text: '✅ STK Push imetumwa kwa nambari yako. Ingiza PIN yako ya M-Pesa kukamilisha malipo ya KES 45,500.' },
  ]

  return (
    <div className="w-full max-w-sm mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* WhatsApp header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">D</div>
        <div>
          <p className="text-white text-sm font-semibold">DukaBot AI</p>
          <p className="text-green-200 text-xs">online · responds instantly</p>
        </div>
        <div className="ml-auto flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* Chat */}
      <div className="bg-[#ECE5DD] dark:bg-[#1a1a2e] p-3 space-y-2 min-h-[320px]">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: m.from === 'customer' ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
            className={`flex ${m.from === 'customer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                m.from === 'customer'
                  ? 'bg-[#DCF8C6] dark:bg-[#2a5c45] text-gray-800 dark:text-gray-100 rounded-tr-sm'
                  : 'bg-white dark:bg-[#2a2a3e] text-gray-800 dark:text-gray-100 rounded-tl-sm'
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ── main page ───────────────────────────────────────────────────────────────
export function LandingPage({ onGetStarted }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="3" height="12" rx="1.5" fill="white"/>
                <rect x="6.5" y="2" width="3" height="8" rx="1.5" fill="white"/>
                <rect x="11" y="2" width="3" height="10" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight">DukaBot AI</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {[['Features', 'features'], ['How it Works', 'how-it-works'], ['Stats', 'stats'], ['Pricing', 'pricing'], ['Testimonials', 'testimonials']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={onGetStarted}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign In
            </button>
            <button onClick={onGetStarted}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.97] transition-all shadow-lg shadow-indigo-600/25">
              Get Started Free
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(v => !v)}>
            <div className={`space-y-1.5 transition-all ${menuOpen ? 'opacity-60' : ''}`}>
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300" />
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300" />
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300" />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
            {[['Features', 'features'], ['How it Works', 'how-it-works'], ['Stats', 'stats'], ['Pricing', 'pricing'], ['Testimonials', 'testimonials']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left text-sm text-gray-700 dark:text-gray-300 py-1">
                {label}
              </button>
            ))}
            <button onClick={onGetStarted}
              className="w-full mt-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-indigo-600 text-white">
              Get Started Free
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/8 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  Built for Kenyan SMEs · Powered by Claude AI
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  Your shop,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    selling 24/7
                  </span>{' '}
                  on WhatsApp
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg"
              >
                DukaBot AI is a WhatsApp-native sales agent that answers customer questions, manages your product catalog, and collects M-Pesa payments — automatically, in Swahili or English, around the clock.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                <button onClick={onGetStarted}
                  className="px-6 py-3 rounded-full text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.97] transition-all shadow-xl shadow-indigo-600/30">
                  Start Free — No Credit Card
                </button>
                <button onClick={() => scrollTo('how-it-works')}
                  className="px-6 py-3 rounded-full text-base font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all">
                  See How It Works →
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex items-center gap-5 pt-2"
              >
                {[
                  '✓ Setup in under 30 min',
                  '✓ No coding required',
                  '✓ M-Pesa built-in',
                ].map(t => (
                  <span key={t} className="text-xs text-gray-500 dark:text-gray-400">{t}</span>
                ))}
              </motion.div>
            </div>

            {/* Right — chat mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <ChatMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Integration logos ── */}
      <section className="border-y border-gray-100 dark:border-gray-800 py-8 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Integrates with the platforms your business already uses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[
              { name: 'WhatsApp', color: '#25D366', letter: 'W' },
              { name: 'M-Pesa', color: '#4CAF50', letter: 'M' },
              { name: 'Safaricom', color: '#00A651', letter: 'S' },
              { name: 'Claude AI', color: '#6366f1', letter: 'C' },
              { name: 'Meta', color: '#0866FF', letter: 'f' },
              { name: 'Railway', color: '#7c3aed', letter: 'R' },
            ].map(({ name, color, letter }) => (
              <div key={name} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: color }}>
                  {letter}
                </div>
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Statistics ── */}
      <section id="stats" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Hard numbers. Real results.
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              DukaBot AI is built on measurable outcomes, not marketing fluff. Here's what the data says.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { stat: 97,   suffix: '%',  label: 'M-Pesa STK Push success rate',       sub: 'Verified across all transactions processed through DukaBot Daraja integration' },
              { stat: 2,    suffix: 's',  label: 'Average AI response time',            sub: 'From customer message received to DukaBot reply — 24 hours a day' },
              { stat: 88,   suffix: '%',  label: 'Bot containment rate',                sub: 'Conversations fully resolved by DukaBot without merchant intervention' },
              { stat: 3,    suffix: '×',  label: 'Higher order conversion',             sub: 'Merchants using DukaBot convert 3× more WhatsApp enquiries into paid orders' },
              { stat: 32,   suffix: 'M+', label: 'WhatsApp users in Kenya',             sub: 'The channel your customers are already on — no app download required' },
              { stat: 85,   suffix: '%',  label: 'Reduction in response workload',      sub: 'Merchant time spent on WhatsApp customer service drops by 85% on average' },
            ].map(({ stat, suffix, label, sub }, i) => (
              <FadeIn key={label} delay={i * 0.07}>
                <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 mb-2">
                    <Counter to={stat} suffix={suffix} />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed">{sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Kenya market context */}
          <FadeIn delay={0.2} className="mt-10">
            <div className="rounded-2xl bg-indigo-600 text-white p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { n: 'KES 30B+',    label: 'M-Pesa transactions daily in Kenya' },
                { n: '7.4M+',       label: 'Kenyan SMEs that could use DukaBot' },
                { n: '40%',         label: 'YoY growth in WhatsApp commerce in Sub-Saharan Africa' },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold">{n}</p>
                  <p className="text-indigo-200 text-sm mt-1">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-28 bg-white dark:bg-gray-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything your shop needs, nothing it doesn't
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              DukaBot replaces five separate tools with one intelligent WhatsApp agent.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Bot,
                color: 'indigo',
                title: 'Claude AI Sales Agent',
                desc: 'Powered by Anthropic\'s Claude — the same AI trusted by Fortune 500 companies. DukaBot understands context, upsells intelligently, and handles complex customer queries in natural language.',
                tag: 'Core',
              },
              {
                icon: MessageCircle,
                color: 'green',
                title: 'WhatsApp-Native',
                desc: 'No app to download. No link to click. Customers message your existing WhatsApp Business number — DukaBot answers instantly, exactly as if you were there.',
                tag: 'Channel',
              },
              {
                icon: Smartphone,
                color: 'emerald',
                title: 'M-Pesa STK Push',
                desc: 'Customers pay without leaving WhatsApp. DukaBot sends the STK Push to their phone, waits for PIN confirmation, and marks the order as paid — in under 60 seconds.',
                tag: 'Payments',
              },
              {
                icon: Package,
                color: 'orange',
                title: 'Live Product Catalog',
                desc: 'Add products with names, prices, stock levels, specifications and images. DukaBot answers "do you have X?" accurately every time, and tells customers when stock is low.',
                tag: 'Catalog',
              },
              {
                icon: BarChart3,
                color: 'purple',
                title: 'Real-Time Analytics',
                desc: 'See chats, orders and revenue by minute, hour, day, week, month or year. Understand what sells, when customers are active, and which products get the most enquiries.',
                tag: 'Insights',
              },
              {
                icon: Globe,
                color: 'blue',
                title: 'Kenglish & Swahili',
                desc: 'Flip between English and Swahili with one toggle. DukaBot understands mixed-language inputs and responds in your chosen language — Nairobi-native from day one.',
                tag: 'Language',
              },
            ].map(({ icon: Icon, color, title, desc, tag }, i) => {
              const iconBg: Record<string, string> = {
                indigo:  'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400',
                green:   'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400',
                emerald: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400',
                orange:  'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400',
                purple:  'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400',
                blue:    'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
              }
              return (
              <FadeIn key={title} delay={i * 0.06}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[color]}`}>
                      <Icon size={20} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {tag}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1">{desc}</p>
                </div>
              </FadeIn>
            )})}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Up and running in 30 minutes</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">No developers. No integrations team. Just follow three steps.</p>
          </FadeIn>

          <div className="space-y-6">
            {[
              {
                step: '01',
                title: 'Connect your WhatsApp Business number',
                desc: 'Link your existing WhatsApp Business account via Meta\'s official Cloud API. DukaBot sits behind your number — customers see your brand, not ours. Takes 5 minutes.',
                detail: 'Meta-verified · Webhook-secured · HMAC-validated',
              },
              {
                step: '02',
                title: 'Upload your product catalog',
                desc: 'Add your products: name, price, stock count, specifications (ingredients, dimensions, warranty) and an optional image URL. DukaBot reads this in real time — update stock and it knows immediately.',
                detail: 'Unlimited items on Growth & Pro · Real-time sync',
              },
              {
                step: '03',
                title: 'DukaBot handles everything else',
                desc: 'From the first "Hello" to the M-Pesa PIN confirmation — DukaBot answers queries, checks availability, quotes prices, upsells related products, and processes payment. You get a dashboard notification for each order.',
                detail: '24/7 availability · 97% M-Pesa success rate · <2s response',
              },
            ].map(({ step, title, desc, detail }, i) => (
              <FadeIn key={step} delay={i * 0.1}>
                <div className="flex gap-5 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    {step}
                  </div>
                  <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex-1 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-base mb-1.5">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-2">{desc}</p>
                    <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{detail}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Revenue impact ── */}
      <section className="py-20 sm:py-28 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">The cost of NOT automating</h2>
            <p className="mt-3 text-gray-400 max-w-xl mx-auto">
              Every missed WhatsApp message is a missed sale. Here's what manual customer service is actually costing Kenyan SMEs.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <FadeIn className="space-y-5">
              {[
                { label: 'Average manual response time', manual: '4+ hours', duka: '< 2 seconds' },
                { label: 'Availability', manual: '8am–6pm', duka: '24/7/365' },
                { label: 'Languages handled', manual: '1 (whoever is on shift)', duka: 'Swahili + English' },
                { label: 'Simultaneous conversations', manual: '1–2 at a time', duka: 'Unlimited' },
                { label: 'Payment collection', manual: 'Send number, wait, confirm manually', duka: 'Automated STK Push in-chat' },
                { label: 'After-hours orders', manual: 'Lost', duka: 'Captured and paid' },
              ].map(({ label, manual, duka }) => (
                <div key={label} className="grid grid-cols-3 gap-3 items-center text-sm">
                  <span className="text-gray-400 text-xs col-span-1">{label}</span>
                  <span className="text-red-400 font-medium text-xs text-center bg-red-950/40 rounded-lg px-2 py-1.5">{manual}</span>
                  <span className="text-green-400 font-medium text-xs text-center bg-green-950/40 rounded-lg px-2 py-1.5">{duka}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3 text-xs text-gray-600 pt-1">
                <span />
                <span className="text-center font-semibold text-gray-500">Without DukaBot</span>
                <span className="text-center font-semibold text-indigo-400">With DukaBot</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center space-y-5">
              <p className="text-5xl font-bold">KES 847K</p>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Average additional annual revenue captured by a Nairobi retail SME after deploying DukaBot — from after-hours orders, faster response conversions, and zero abandoned chats.
              </p>
              <div className="h-px bg-white/20" />
              <p className="text-sm text-indigo-200">Growth plan costs <strong className="text-white">KES 35,988/year</strong></p>
              <p className="text-xs text-indigo-300">That's a <strong className="text-white text-sm">23× return on investment</strong></p>
              <button onClick={onGetStarted}
                className="w-full rounded-full py-3 text-sm font-semibold bg-white text-indigo-700 hover:bg-indigo-50 transition-all active:scale-[0.97]">
                Start Capturing Revenue Now
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 sm:py-28 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Merchants across Kenya trust DukaBot</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Mary Wanjiku',
                shop: 'Wanjiku\'s Kitchen Store · Westlands, Nairobi',
                avatar: 'MW',
                quote: 'Before DukaBot I was replying to WhatsApp messages at midnight. Now customers order, pay via M-Pesa, and get confirmation — while I sleep. My sales went up 40% in the first month.',
                stars: 5,
              },
              {
                name: 'Peter Otieno',
                shop: 'Otieno Electronics · Kisumu CBD',
                avatar: 'PO',
                quote: 'The M-Pesa integration is seamless. Customers don\'t even realize they\'re talking to a bot — they think I hired someone. DukaBot handles 90% of my WhatsApp enquiries without me touching my phone.',
                stars: 5,
              },
              {
                name: 'Grace Njeri',
                shop: 'Njeri Fashion · Mombasa Road',
                avatar: 'GN',
                quote: 'Nilikuwa nafikiri AI ni kwa makampuni makubwa tu. DukaBot ni rahisi sana — nilianza ndani ya dakika 20. Sasa ninauza Swahili na English bila tatizo lolote.',
                stars: 5,
              },
            ].map(({ name, shop, avatar, quote, stars }, i) => (
              <FadeIn key={name} delay={i * 0.08}>
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 flex flex-col gap-4 h-full">
                  <div className="flex gap-1">
                    {Array(stars).fill(0).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 italic">"{quote}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-gray-500">{shop}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ── */}
      <section id="pricing" className="py-20 sm:py-28 bg-gray-50 dark:bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple pricing. No surprises.</h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400">Start free. Upgrade as you grow. Cancel anytime.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: 'KES 1,499',
                period: '/month',
                desc: 'For small shops getting started',
                features: ['200 WhatsApp chats/month', '50-item catalog', 'M-Pesa STK Push', 'Basic analytics', 'Email support'],
                cta: 'Start Free Trial',
                highlight: false,
              },
              {
                name: 'Growth',
                price: 'KES 3,999',
                period: '/month',
                desc: 'Our most popular plan',
                features: ['1,000 WhatsApp chats/month', 'Unlimited catalog', 'M-Pesa + full analytics', 'Customer segmentation', 'Priority support'],
                cta: 'Start Free Trial',
                highlight: true,
              },
              {
                name: 'Pro',
                price: 'KES 8,999',
                period: '/month',
                desc: 'For high-volume merchants',
                features: ['Unlimited chats', 'Multi-agent support', 'Custom AI tone', 'API access', 'Dedicated account manager'],
                cta: 'Contact Sales',
                highlight: false,
              },
            ].map(({ name, price, period, desc, features, cta, highlight }, i) => (
              <FadeIn key={name} delay={i * 0.08}>
                <div className={`rounded-2xl p-6 flex flex-col gap-4 h-full ${
                  highlight
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-500 shadow-xl shadow-indigo-600/25'
                    : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800'
                }`}>
                  {highlight && <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Most Popular</span>}
                  <div>
                    <h3 className="font-bold text-lg">{name}</h3>
                    <p className={`text-xs mt-0.5 ${highlight ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}`}>{desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{price}</span>
                    <span className={`text-sm ${highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{period}</span>
                  </div>
                  <ul className="space-y-2 flex-1">
                    {features.map(f => (
                      <li key={f} className={`flex items-center gap-2 text-sm ${highlight ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        <Check size={13} className={highlight ? 'text-indigo-300 shrink-0' : 'text-indigo-600 shrink-0'} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={onGetStarted}
                    className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all active:scale-[0.97] ${
                      highlight
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}>
                    {cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <p className="text-center text-xs text-gray-500 mt-6">14-day free trial on all plans · M-Pesa & card accepted · Cancel anytime</p>
          </FadeIn>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FadeIn>
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 blur-2xl" />
              <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-gray-900 p-10 sm:p-16 shadow-xl">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  Stop losing sales to slow responses
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-base mb-8 max-w-lg mx-auto leading-relaxed">
                  Join Kenyan merchants who have automated their WhatsApp sales with DukaBot AI. Set up in 30 minutes. Start earning while you sleep.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={onGetStarted}
                    className="px-8 py-3.5 rounded-full text-base font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 active:scale-[0.97] transition-all">
                    Create Your Free Account
                  </button>
                  <button onClick={() => scrollTo('how-it-works')}
                    className="px-8 py-3.5 rounded-full text-base font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    Watch How It Works
                  </button>
                </div>
                <p className="mt-5 text-xs text-gray-400">No credit card required · Free 14-day trial · Cancel anytime</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-10 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="3" height="12" rx="1.5" fill="white"/>
                  <rect x="6.5" y="2" width="3" height="8" rx="1.5" fill="white"/>
                  <rect x="11" y="2" width="3" height="10" rx="1.5" fill="white"/>
                </svg>
              </div>
              <span className="text-sm font-bold">DukaBot AI</span>
              <span className="text-gray-300 dark:text-gray-600 text-sm">·</span>
              <span className="text-xs text-gray-500">© 2026 Axon Lattice Ltd, Nairobi Kenya</span>
            </div>
            <div className="flex gap-5 text-xs text-gray-500">
              <button onClick={onGetStarted} className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</button>
              <button onClick={onGetStarted} className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</button>
              <button onClick={onGetStarted} className="hover:text-gray-900 dark:hover:text-white transition-colors">Refund Policy</button>
              <a href="mailto:support@axonlattice.dev" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
