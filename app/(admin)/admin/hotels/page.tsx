"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import AddHotelModal from "@/components/admin/AddHotelModal"

export default function AdminHotelsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Hotel Inventory</h1>
          <p className="text-slate-500">Manage your hotel listings and safety verifications</p>
        </div>
        
        {/* click button model l open*/}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-6 font-bold shadow-lg flex gap-2"
        >
          <Plus size={20} /> Add New Hotel
        </Button>
      </div>

      {/* hotel list come here (Table or Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-50 italic text-slate-400">
        Hotel listings will appear here...
      </div>

      {/* Add Hotel Modal  */}
      <AddHotelModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}