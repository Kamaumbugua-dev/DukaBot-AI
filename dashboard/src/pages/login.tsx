import { useRef, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import WaterRipple, { type WaterRippleHandle } from '@/components/water-ripple'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Props {
  onLogin: () => void
}

function elementToGLCoords(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return {
    x: (rect.left + rect.width  / 2) / window.innerWidth,
    y: 1 - (rect.top + rect.height / 2) / window.innerHeight,
  }
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.252 17.64 11.945 17.64 9.205Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

export function LoginPage({ onLogin }: Props) {
  const rippleRef   = useRef<WaterRippleHandle>(null)
  const cardRef     = useRef<HTMLDivElement>(null)
  const lastMoveRef = useRef(0)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loading, setLoading]     = useState(false)
  const [acceptedTos, setAcceptedTos] = useState(false)

  const addRippleAt = useCallback((el: HTMLElement | null, amp = 0.7) => {
    if (!el) return
    const { x, y } = elementToGLCoords(el)
    rippleRef.current?.addRipple(x, y, amp)
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const now = Date.now()
    if (now - lastMoveRef.current < 300) return
    lastMoveRef.current = now
    rippleRef.current?.addRipple(
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight,
      0.18,
    )
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    addRippleAt(cardRef.current, 1.0)
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin() }, 900)
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Pearl-white water ripple background */}
      <WaterRipple ref={rippleRef} className="absolute inset-0" />

      {/* Very subtle edge darkening so card pops without killing the light feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(160,165,180,0.25) 100%)',
        }}
      />

      {/* Card + below-card text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-5">

        {/* ── Liquid glass card ── */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => addRippleAt(cardRef.current, 0.5)}
          onMouseMove={handleMouseMove}
          className="relative w-full max-w-sm"
        >
          {/* Iridescent gradient border ring */}
          <div
            className="absolute -inset-[1px] rounded-2xl pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(200,210,230,0.5) 40%, rgba(180,190,220,0.4) 70%, rgba(255,255,255,0.8) 100%)',
            }}
          />

          {/* Glass surface */}
          <div
            className="relative rounded-2xl overflow-hidden px-8 py-9 flex flex-col gap-5"
            style={{
              background: 'rgba(255, 255, 255, 0.48)',
              backdropFilter: 'blur(24px) saturate(160%) brightness(1.08)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%) brightness(1.08)',
              boxShadow:
                '0 8px 40px rgba(140,150,170,0.22), 0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(200,210,230,0.3) inset',
            }}
          >
            {/* Top specular edge */}
            <div
              className="absolute top-0 left-10 right-10 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)',
              }}
            />

            {/* Brand */}
            <div className="flex flex-col items-center gap-2 mb-1">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{
                    background: 'rgba(24,24,27,0.88)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  }}
                >
                  {/* Wordmark bars */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="3" height="12" rx="1.5" fill="white"/>
                    <rect x="6.5" y="2" width="3" height="8"  rx="1.5" fill="white"/>
                    <rect x="11" y="2" width="3" height="10" rx="1.5" fill="white"/>
                  </svg>
                </div>
                <span className="text-base font-bold text-gray-900 tracking-tight">DukaBot AI</span>
              </div>
            </div>

            {/* Google button */}
            <button
              type="button"
              onClick={e => addRippleAt(e.currentTarget, 0.65)}
              className="flex items-center justify-center gap-3 w-full rounded-full py-2.5 text-sm font-medium text-gray-700 transition-all"
              style={{
                background: 'rgba(255,255,255,0.60)',
                border: '1px solid rgba(200,210,225,0.7)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <GoogleIcon />
              Sign in with Google
            </button>

            {/* OR divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(180,190,210,0.5)' }} />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(180,190,210,0.5)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  className="w-full rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.55)',
                    border: '1px solid rgba(190,200,220,0.65)',
                    backdropFilter: 'blur(8px)',
                  }}
                  onFocus={e => {
                    e.currentTarget.style.border = '1.5px solid rgba(99,102,241,0.55)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)'
                    addRippleAt(e.currentTarget, 0.6)
                  }}
                  onBlur={e => {
                    e.currentTarget.style.border = '1px solid rgba(190,200,220,0.65)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(190,200,220,0.65)',
                  backdropFilter: 'blur(8px)',
                }}
                onFocus={e => {
                  e.currentTarget.style.border = '1.5px solid rgba(99,102,241,0.55)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)'
                  addRippleAt(e.currentTarget, 0.6)
                }}
                onBlur={e => {
                  e.currentTarget.style.border = '1px solid rgba(190,200,220,0.65)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />

              {/* Terms of Service */}
              <div className="flex flex-col gap-2 mt-1">
                <ScrollArea
                  className="h-28 w-full rounded-xl border"
                  style={{
                    background: 'rgba(255,255,255,0.40)',
                    borderColor: 'rgba(190,200,220,0.65)',
                  }}
                >
                  <div className="p-3">
                    <h4 className="mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Terms of Service
                    </h4>
                    <div className="space-y-2.5 text-xs text-gray-500 leading-relaxed">
                      <p>Welcome to DukaBot AI. By accessing or using our service, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                      <p>You must be at least 18 years old to use this service. By using this service, you represent and warrant that you meet this requirement.</p>
                      <p>We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice.</p>
                      <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the service without express written permission by us.</p>
                      <p>We reserve the right to refuse service to anyone for any reason at any time. Your content may be transferred and involve transmissions over various networks.</p>
                      <p>We do not warrant that the service will be uninterrupted, timely, secure, or error-free. We may remove the service for indefinite periods of time or cancel at any time.</p>
                      <p>You agree to indemnify and hold DukaBot AI and its affiliates, officers, agents, and employees harmless from any claim or demand arising out of your breach of these Terms.</p>
                    </div>
                  </div>
                </ScrollArea>

                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={acceptedTos}
                      onChange={e => setAcceptedTos(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center transition-all"
                      style={{
                        background: acceptedTos ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.6)',
                        border: acceptedTos ? '1.5px solid #6366f1' : '1.5px solid rgba(190,200,220,0.8)',
                        boxShadow: acceptedTos ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
                      }}
                      onClick={() => setAcceptedTos(v => !v)}
                    >
                      {acceptedTos && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600">
                    I have read and agree to the{' '}
                    <span className="text-indigo-600 font-medium underline underline-offset-2 cursor-pointer">
                      Terms of Service
                    </span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !acceptedTos}
                onClick={e => addRippleAt(e.currentTarget, 1.0)}
                className="w-full rounded-full py-2.5 text-sm font-semibold text-white transition-all mt-1 active:scale-[0.98]"
                style={{
                  background: loading || !acceptedTos
                    ? 'rgba(99,102,241,0.40)'
                    : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: loading || !acceptedTos ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
                  cursor: !acceptedTos ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Signing in…' : 'Log in'}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Below-card link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-sm text-gray-600"
        >
          Don't have an account yet?{' '}
          <span className="text-gray-900 font-medium underline underline-offset-2 cursor-pointer hover:text-indigo-600 transition-colors">
            Sign up
          </span>
        </motion.p>
      </div>
    </div>
  )
}
