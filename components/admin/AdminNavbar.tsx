// components/admin/AdminNavbar.tsx
import { Bell, Search } from "lucide-react"

export function AdminNavbar() {
  return (
    <header className="h-16 border-b bg-[#F2FFF5] px-8 flex items-center justify-between sticky top-0 z-20">
      <h3 className="font-semibold text-slate-800 text-lg">Admin Control Panel</h3>
      
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 border-l pl-6">
          <button className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">Manusha</p>
              <p className="text-xs text-slate-500 mt-1">Super Admin</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center font-bold text-blue-700">
              MT
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}