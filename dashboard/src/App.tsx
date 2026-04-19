import { useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { OverviewPage }    from '@/pages/overview'
import { OrdersPage }      from '@/pages/orders'
import { AnalyticsPage }   from '@/pages/analytics'
import { CustomersPage }   from '@/pages/customers'
import { SettingsPage }    from '@/pages/settings'
import { TestimonialsPage } from '@/pages/testimonials'
import { AboutPage }       from '@/pages/about'
import { HowItWorksPage }  from '@/pages/how-it-works'
import { FeaturesPage }    from '@/pages/features'
import { DocsPage }        from '@/pages/docs'
import { LegalPage }       from '@/pages/legal'
import { HelpPage }        from '@/pages/help'
import { LoginPage }       from '@/pages/login'
import { LandingPage }     from '@/pages/landing'
import { PricingPage }     from '@/pages/pricing'
import { PaymentPage, type PaymentPlan } from '@/pages/payment'
import { CatalogPage }     from '@/pages/catalog'
import { AdminPage }       from '@/pages/admin'
import { Footer }          from '@/components/footer'

export type Page =
  | 'overview' | 'orders' | 'analytics' | 'customers' | 'settings' | 'testimonials'
  | 'about' | 'how-it-works' | 'features' | 'docs' | 'legal' | 'help' | 'pricing' | 'catalog'

const PAGE_TITLES: Record<Page, string> = {
  overview:      'Overview',
  orders:        'Orders',
  analytics:     'Analytics',
  customers:     'Customers',
  settings:      'Settings',
  testimonials:  'Testimonials',
  about:         'About',
  'how-it-works':'How it Works',
  features:      'Features',
  docs:          'Documentation',
  legal:         'Legal',
  help:          'Help & Support',
  pricing:       'Pricing',
  catalog:       'Product Catalog',
}

export default function App() {
  const [authed, setAuthed]           = useState(false)
  const [isAdmin, setIsAdmin]         = useState(false)
  const [showLogin, setShowLogin]     = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('overview')
  const [pendingPayment, setPendingPayment] = useState<PaymentPlan | null>(null)

  // Visitor — show public portfolio landing page
  if (!authed && !showLogin) {
    return <LandingPage onGetStarted={() => setShowLogin(true)} />
  }

  // Visitor clicked Sign In / Get Started — show login gate
  if (!authed && showLogin) {
    return (
      <LoginPage
        onLogin={(adminFlag) => {
          setAuthed(true)
          setIsAdmin(!!adminFlag)
          setShowLogin(false)
        }}
      />
    )
  }

  // Admin — show separate admin dashboard
  if (authed && isAdmin) {
    return (
      <AdminPage
        onSignOut={() => { setAuthed(false); setIsAdmin(false); setShowLogin(false) }}
      />
    )
  }

  // Payment full-screen overlay — shown over the dashboard when a plan is selected
  if (pendingPayment) {
    return (
      <PaymentPage
        plan={pendingPayment}
        onDone={() => { setPendingPayment(null); setCurrentPage('overview') }}
      />
    )
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-semibold">{PAGE_TITLES[currentPage]}</h1>
          </header>
          {/* Footer lives inside main so it scrolls with content — no overlap */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {currentPage === 'overview'     && <OverviewPage />}
              {currentPage === 'orders'       && <OrdersPage />}
              {currentPage === 'analytics'    && <AnalyticsPage />}
              {currentPage === 'customers'    && <CustomersPage />}
              {currentPage === 'settings'     && <SettingsPage onNavigate={setCurrentPage} />}
              {currentPage === 'testimonials' && <TestimonialsPage />}
              {currentPage === 'about'        && <AboutPage />}
              {currentPage === 'how-it-works' && <HowItWorksPage />}
              {currentPage === 'features'     && <FeaturesPage />}
              {currentPage === 'docs'         && <DocsPage />}
              {currentPage === 'legal'        && <LegalPage />}
              {currentPage === 'help'         && <HelpPage />}
              {currentPage === 'pricing'      && <PricingPage onBuyNow={(plan) => setPendingPayment(plan)} />}
              {currentPage === 'catalog'      && <CatalogPage />}
            </div>
            <Footer onNavigate={setCurrentPage} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
