import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import {
  BotIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
  TwitterIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { Page } from "@/App"

type NavItem =
  | { name: string; page: Page }
  | { name: string; href: string }

const navigation: { id: string; name: string; items: NavItem[] }[] = [
  {
    id: "product",
    name: "Product",
    items: [
      { name: "Overview",      page: "overview"      },
      { name: "How it Works",  page: "how-it-works"  },
      { name: "Pricing",       page: "pricing"       },
    ],
  },
  {
    id: "features",
    name: "Features",
    items: [
      { name: "WhatsApp Bot",    page: "features"  },
      { name: "M-Pesa Payments", page: "features"  },
      { name: "Analytics",       page: "analytics" },
    ],
  },
  {
    id: "resources",
    name: "Resources",
    items: [
      { name: "Documentation", page: "docs" },
      { name: "API Reference", page: "docs" },
      { name: "Status",        page: "docs" },
    ],
  },
  {
    id: "company",
    name: "Company",
    items: [
      { name: "About",   page: "about" },
      { name: "Contact", page: "help"  },
      { name: "Terms",   page: "legal" },
    ],
  },
  {
    id: "legal",
    name: "Legal",
    items: [
      { name: "Privacy Policy", page: "legal" },
      { name: "Cookie Policy",  page: "legal" },
      { name: "Refund Policy",  page: "legal" },
    ],
  },
  {
    id: "support",
    name: "Support",
    items: [
      { name: "Help Centre",      page: "help" },
      { name: "WhatsApp Support", href: "https://wa.me/254700000000" },
      { name: "Report a Bug",     page: "help" },
    ],
  },
]

const iconClass =
  "hover:-translate-y-1 border border-dotted rounded-xl p-2.5 transition-transform"

const socials = [
  { label: "Email",      href: "mailto:support@dukabot.ai",          icon: MailIcon      },
  { label: "Twitter/X",  href: "https://x.com/dukabot_ai",           icon: TwitterIcon   },
  { label: "Instagram",  href: "https://instagram.com/dukabot.ai",   icon: InstagramIcon },
  { label: "WhatsApp",   href: "https://wa.me/254700000000",          icon: WhatsappIcon  },
  { label: "Facebook",   href: "https://facebook.com/dukabot",        icon: FacebookIcon  },
  { label: "LinkedIn",   href: "https://linkedin.com/company/dukabot",icon: LinkedinIcon  },
  { label: "YouTube",    href: "https://youtube.com/@dukabot",        icon: YoutubeIcon   },
]

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  )
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])
  return (
    <button onClick={() => setDark(d => !d)} className={iconClass} aria-label="Toggle theme">
      <HugeiconsIcon icon={dark ? SunIcon : MoonIcon} size={20} />
    </button>
  )
}

interface FooterProps {
  onNavigate: (page: Page) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mx-auto mt-16 flex w-full flex-col items-center justify-center border-t">
      {/* Brand blurb */}
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex">
        <button
          onClick={() => onNavigate("overview")}
          className="flex items-center justify-center rounded-full shrink-0"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HugeiconsIcon icon={BotIcon} size={20} />
          </div>
        </button>
        <p className="text-muted-foreground text-center text-xs leading-5 md:text-left max-w-xl">
          DukaBot AI helps Kenyan SMEs sell more through WhatsApp — handling
          customer conversations, product discovery, and M-Pesa payments
          automatically. Built for the hustle of the Nairobi market, available
          24/7 so you never miss a sale.
        </p>
      </div>

      {/* Nav links */}
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="border-b border-dotted mb-10" />
        <div className="grid grid-cols-3 gap-6 md:flex md:flex-row md:justify-between leading-6">
          {navigation.map((section) => (
            <div key={section.id}>
              <p className="text-xs font-semibold text-foreground mb-3">{section.name}</p>
              <ul role="list" className="flex flex-col space-y-2">
                {section.items.map((item) => (
                  <li key={item.name} className="flow-root">
                    {"page" in item ? (
                      <button
                        onClick={() => onNavigate(item.page)}
                        className="text-xs text-slate-600 hover:text-black dark:text-slate-400 hover:dark:text-white transition-colors text-left"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-600 hover:text-black dark:text-slate-400 hover:dark:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-b border-dotted mt-10" />
      </div>

      {/* Socials + theme */}
      <div className="flex flex-wrap justify-center gap-y-6 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-4 px-6">
          {socials.map(({ label, href, icon }) => (
            <a key={label} aria-label={label} href={href} rel="noreferrer" target="_blank" className={iconClass}>
              <HugeiconsIcon icon={icon} size={20} />
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-4 mb-10 flex flex-col justify-between text-center text-xs max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
          <span>©</span>
          <span>{new Date().getFullYear()}</span>
          <span>Made with</span>
          <Heart className="mx-1 h-4 w-4 animate-pulse text-red-500" />
          <span>by the</span>
          <button onClick={() => onNavigate("about")} className="font-bold text-black dark:text-white hover:underline">
            DukaBot AI
          </button>
          <span>team · Nairobi, Kenya</span>
        </div>
      </div>
    </footer>
  )
}
