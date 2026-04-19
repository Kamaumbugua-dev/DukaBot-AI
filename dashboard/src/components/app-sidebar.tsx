import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Bot,
  MessageSquare,
  Heart,
  CreditCard,
  Package,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Page } from '@/App'

const NAV_ITEMS: { label: string; page: Page; icon: React.ElementType }[] = [
  { label: 'Overview', page: 'overview', icon: LayoutDashboard },
  { label: 'Orders', page: 'orders', icon: ShoppingCart },
  { label: 'Analytics', page: 'analytics', icon: BarChart3 },
  { label: 'Customers', page: 'customers', icon: Users },
  { label: 'Catalog',      page: 'catalog',      icon: Package    },
  { label: 'Testimonials', page: 'testimonials', icon: Heart      },
  { label: 'Pricing',      page: 'pricing',      icon: CreditCard },
]

interface Props {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function AppSidebar({ currentPage, onNavigate }: Props) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">DukaBot AI</span>
            <span className="text-xs text-muted-foreground">Merchant Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, page, icon: Icon }) => (
                <SidebarMenuItem key={page}>
                  <SidebarMenuButton
                    isActive={currentPage === page}
                    onClick={() => onNavigate(page)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={currentPage === 'settings'}
                  onClick={() => onNavigate('settings')}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => window.open('https://wa.me', '_blank')}>
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp Preview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium">Merchant</span>
            <span className="text-xs text-muted-foreground">Luthuli Ave Shop</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
