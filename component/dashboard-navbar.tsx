"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react"

export default function DashboardNavbar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-green-50 border-b bg-background">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Menu className="h-5 w-5" />
        </Button>

        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-center gap-2 text-red-600">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  )
}
