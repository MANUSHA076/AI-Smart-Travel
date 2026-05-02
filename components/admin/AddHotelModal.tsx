"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, MapPin, DollarSign, ShieldAlert } from "lucide-react"

export default function AddHotelModal({ isOpen, onClose }: any) {
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-8 rounded-[2.5rem] border-none bg-white/90 backdrop-blur-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
            Add New Hotel
          </DialogTitle>
          <p className="text-slate-500 text-sm">Fill in the details to list a new hotel</p>
        </DialogHeader>

        <div className="space-y-5 mt-6">
          {/* Hotel Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hotel Name</label>
            <Input className="rounded-xl border-slate-100 bg-slate-50/50 py-6" placeholder="e.g. Ella Jungle Resort" />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <Input className="rounded-xl border-slate-100 bg-slate-50/50 py-6 pl-10" placeholder="Ella, Sri Lanka" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price/Night</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <Input type="number" className="rounded-xl border-slate-100 bg-slate-50/50 py-6 pl-10" placeholder="120" />
              </div>
            </div>

            {/* Risk Level */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Risk Status</label>
              <Select>
                <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50/50 py-6">
                  <SelectValue placeholder="Select Risk" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
            <div className="relative">
              <ImagePlus className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <Input className="rounded-xl border-slate-100 bg-slate-50/50 py-6 pl-10" placeholder="https://..." />
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-8 rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-200 mt-4 transition-all active:scale-95"
            onClick={() => {
              setLoading(true);
              setTimeout(() => { setLoading(false); onClose(); }, 1500); // Dummy saving effect
            }}
          >
            {loading ? "Saving to Database..." : "Save & List Hotel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}