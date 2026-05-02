"use client"
import { LayoutDashboard, AlertTriangle, Route, Hotel, Settings, CircleHelpIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname()
  const sidebarStyle = {
    background: "#F2FFF5",
  }

  const links = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Safety Alerts", href: "/dashboard/alerts", icon: AlertTriangle },
    { name: "AI Routes", href: "/dashboard/routes", icon: Route },
    { name: "Hotels", href: "/dashboard/hotels", icon: Hotel },
  ]

  return (
    <aside
      className="w-64 border-r border-slate-900/10 flex flex-col h-screen sticky top-0 text-slate-900"
      style={sidebarStyle}
    >
<div className="p-6">
        <h2 className="brand-logo text-xl font-bold text-slate-900 flex items-center gap-2">
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
              className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 w-full ${
                isActive
                  ? "active bg-blue-300 text-black shadow-md border"
                  : "text-slate-700 hover:bg-blue-200 hover:text-blue-900"
              }`}
            >
              <link.icon className="sidebar-icon h-5 w-5 transition-transform duration-300" />
              <span className="font-medium">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-900/10 space-y-1">
        <button className="footer-button flex items-center gap-3 px-4 py-2 w-full text-slate-700 hover:bg-blue-200 hover:text-blue-900 rounded-lg transition-all duration-300">
          <Settings className="h-5 w-5" /> <span>Settings</span>
        </button>
        <button className="footer-button flex items-center gap-3 px-4 py-2 w-full text-slate-700 hover:bg-blue-200 hover:text-blue-900 rounded-lg transition-all duration-300">
          <CircleHelpIcon className="h-5 w-5" /> <span>Help</span>
        </button>
      </div>
    </aside>
  )
}
