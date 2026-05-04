"use client"

import {
  LayoutDashboard,
  AlertTriangle,
  Route,
  Hotel,
  Settings,
  CircleHelpIcon,
} from "lucide-react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { open } = useSidebar()

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Safety Alerts", href: "/dashboard/alerts", icon: AlertTriangle },
    { name: "AI Routes", href: "/dashboard/routes", icon: Route },
    { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  ]

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen w-64
        bg-[#F2FFF5] text-slate-900 border-r border-slate-900/10
        transition-transform duration-300 ease-in-out

        /* 📱 mobile / tablet */
        ${open ? "translate-x-0" : "-translate-x-full"}

        /* 🖥 desktop (lg) → Always Show */
        lg:translate-x-0
      `}
    >
      <div className="p-6">
        <h2 className="brand-logo text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>✈️</span> Safe Travel
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive =
            link.href === "/dashboard"
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`)

          return (
             <Link
              key={link.name}
              href={link.href}
              className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full text-sm ${
                isActive
                  ? "active bg-blue-300 text-black shadow-md border "
                  : "text-slate-700 hover:bg-blue-200 hover:text-blue-900"
              }`}
            >
              <link.icon className="sidebar-icon h-5 w-5 transition-transform duration-300" />
              <span className="font-medium">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-slate-900/10 space-y-1 bg-[#F2FFF5]">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-700 hover:bg-blue-200 hover:text-blue-900 rounded-lg transition-all duration-300 text-sm">
          <Settings className="h-5 w-5" /> Settings
        </button>
        <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-700 hover:bg-blue-200 hover:text-blue-900 rounded-lg transition-all duration-300 text-sm">
          <CircleHelpIcon className="h-5 w-5" /> Help
        </button>
      </div>
    </aside>
  )
}