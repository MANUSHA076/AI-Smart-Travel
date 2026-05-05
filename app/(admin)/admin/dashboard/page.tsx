"use client"

import { StatsOverview } from '@/components/admin/StatsOverview'

export default function AdminDashboard() {
  // Simple now — layout already includes the Sidebar.
  return (
    <div className="space-y-6">
      <StatsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h2 className="font-bold mb-4">Recent Activity</h2>
          <p className="text-slate-500">Elephant movements tracked recently...</p>
        </div>
        
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h2 className="font-bold mb-4">System Alerts</h2>
          <p className="text-slate-500">No critical issues reported.</p>
        </div>
      </div>
    </div>
  )
}