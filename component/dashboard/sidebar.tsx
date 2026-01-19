"use client"

import Link from "next/link"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Plane, LayoutDashboard, AlertTriangle, Route, Hotel, User, Settings, CircleHelpIcon } from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { label: "Overview", icon: <LayoutDashboard className="h-5 w-5" />, href: "/dashboard" },
    { label: "Safety Alerts", icon: <AlertTriangle className="h-5 w-5" />, href: "/dashboard/alerts" },
    { label: "AI Routes", icon: <Route className="h-5 w-5" />, href: "/dashboard/routes" },
    { label: "Hotels", icon: <Hotel className="h-5 w-5" />, href: "/dashboard/hotels" },
    { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
    { label: "Help", icon: <CircleHelpIcon className="h-5 w-5" />, href: "/dashboard/help" },
  ]

  return (
    <Sidebar className="w-64 bg-green-50 border-r flex flex-col">
      
      {/* Header */}
      <SidebarHeader className="px-4 py-5 bg-green-50 border-b">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-blue-400 transition-transform duration-200 hover:scale-110" />
          <span className="text-lg font-bold text-gray-700">Safe Travel</span>
        </div>
      </SidebarHeader>

      {/* Menu Items */}
      <SidebarContent className="flex-1 p-4">
        <SidebarGroup className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} passHref>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-2 px-4 py-2 text-bold rounded-md transition-colors duration-200
                    ${isActive ? "bg-blue-500 text-white hover:bg-blue-600" : "text-gray-700 hover:bg-blue-100"}
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </SidebarGroup>
      </SidebarContent>

      {/* Profile Footer */}
      <SidebarFooter className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 transition-colors duration-200"
        >
          <User className="h-5 w-5" />
          Profile
        </Button>
      </SidebarFooter>

      {/* Bottom Footer */}
      <SidebarFooter className="mt-auto p-4 border-t text-sm text-gray-500">
        © 2026 Safe Travel
      </SidebarFooter>
    </Sidebar>
  )
}
