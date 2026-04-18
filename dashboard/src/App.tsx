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
import { Footer }          from '@/components/footer'

export type Page =
  | 'overview' | 'orders' | 'analytics' | 'customers' | 'settings' | 'testimonials'
  | 'about' | 'how-it-works' | 'features' | 'docs' | 'legal' | 'help'

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
}

export default function App() {
  const [authed, setAuthed]           = useState(false)
  const [currentPage, setCurrentPage] = useState<Page>('overview')

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />
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
              {currentPage === 'settings'     && <SettingsPage />}
              {currentPage === 'testimonials' && <TestimonialsPage />}
              {currentPage === 'about'        && <AboutPage />}
              {currentPage === 'how-it-works' && <HowItWorksPage />}
              {currentPage === 'features'     && <FeaturesPage />}
              {currentPage === 'docs'         && <DocsPage />}
              {currentPage === 'legal'        && <LegalPage />}
              {currentPage === 'help'         && <HelpPage />}
            </div>
            <Footer onNavigate={setCurrentPage} />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
