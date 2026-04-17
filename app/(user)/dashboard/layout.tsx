import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/component/dashboard/sidebar"
import DashboardNavbar from "@/component/dashboard-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {/* Container eka mulu screen ekama cover karaganna 'w-full' danna */}
      <div className="flex min-h-screen w-full">

        {/* Sidebar */}
        <AppSidebar />

        {/* Navbar saha Content ekata 'w-full' danna width eka hari yanna */}
        <div className="flex flex-col flex-1 w-full">
          
          <DashboardNavbar />

          {/* Page Content */}
          {/* Layout eka center karanna nam 'mx-auto' danna puluwan, 
              namuth dashbaord ekakata 'w-full' thama godak welawata hariyanne */}
          <main className="flex-1 p-6 bg-muted/40 w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto w-full"> 
               {children}
            </div>
          </main>
          
        </div>
      </div>
    </SidebarProvider>
  )
}