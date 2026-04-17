// app/(admin)/admin/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminNavbar } from "@/components/admin/AdminNavbar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* මෙහිදී Props යවන්න අවශ්‍ය නැත */}
        <AdminSidebar /> 
        
        <div className="flex flex-col flex-1">
          <AdminNavbar />
          <main className="p-6 bg-slate-50/50 flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}