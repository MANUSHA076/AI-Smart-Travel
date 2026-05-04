"use client"

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "@/component/dashboard/sidebar" // Import path නිවැරදි කරගන්න
import DashboardNavbar from "@/component/dashboard-navbar" // Import path නිවැරදි කරගන්න

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useSidebar()

  return (
    <div className="flex min-h-screen w-full bg-background">
      
      {/* SIDEBAR */}
      <AppSidebar />

      {/* MOBILE OVERLAY - Sidebar එක විවෘතව ඇති විට පිටුපස අඳුරු කිරීමට */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <div
        className="flex flex-col flex-1 w-full transition-all duration-300 lg:ml-64"
      >
        {/* NAVBAR */}
        <DashboardNavbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6 bg-muted/40 w-full overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  )
}