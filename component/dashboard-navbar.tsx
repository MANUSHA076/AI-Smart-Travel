"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react"

export default function DashboardNavbar() {
  const [logoutOpen, setLogoutOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b bg-background">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>

          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* USER DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>MT</AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium">
                  Manusha
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600"
                onClick={() => setLogoutOpen(true)}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </header>

      {/* LOGOUT CONFIRM DIALOG */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to log out of your account?
          </p>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setLogoutOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                setLogoutOpen(false)
                console.log("Logout confirmed")
                // later: auth signOut()
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
