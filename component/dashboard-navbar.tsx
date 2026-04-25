"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  // 1. Session එක ලබා ගැනීම
  const { data: session } = authClient.useSession();

  // 2. නමේ මුල් අකුරු දෙක ලබා ගන්නා Function එක
  const getInitials = (name: string) => {
    if (!name) return "MT";
    const names = name.split(" ");
    if (names.length >= 2) {
      // නමේ කොටස් දෙකක් හෝ වැඩි නම් මුල් අකුරු දෙක ගන්නවා
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    // එක නමක් පමණක් තිබේ නම් එහි මුල් අකුරු දෙක ගන්නවා
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

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
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* USER DROPDOWN */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 hover:bg-accent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user.image || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {/* මෙන්න මෙතනදී Initials පෙන්වනවා */}
                    {getInitials(session?.user.name || "User")}
                  </AvatarFallback>
                </Avatar>

                
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 text-red-600 cursor-pointer"
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
          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setLogoutOpen(false);
                handleLogout();
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