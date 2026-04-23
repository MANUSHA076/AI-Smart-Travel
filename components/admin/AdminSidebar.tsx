"use client"
import { LayoutDashboard, Users, MapPin, AlertTriangle, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Risk Zones", href: "/admin/risk-zones", icon: MapPin },
    { name: "Safety Alerts", href: "/admin/alerts", icon: AlertTriangle },
  ]

  return (
    <aside className="w-64 border-r bg-green-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span>✈️</span> Safe Travel Admin
        </h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          // දැනට ඉන්න URL එක අනුව active එක තීරණය කරයි
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
                isActive ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-1">
        <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Settings className="h-5 w-5" /> <span>Settings</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <HelpCircle className="h-5 w-5" /> <span>Help</span>
        </button>
      </div>
    </aside>
  )
}