"use client"
import { useState, useMemo } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import HotelDetailModal from "@/components/HotelDetailModal"
import {
  MapPin, Star, Search, SlidersHorizontal,
  X, ChevronDown, CheckCircle2, ShieldCheck, Cpu
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// ─── Types ────────────────────────────────────────────────────────────────────

type Risk = "Low" | "Medium" | "High"

type Hotel = {
  id: number
  name: string
  location: string
  rating: number
  price: number
  risk: Risk
  image: string
}

type Booking = {
  hotelId: number
  hotelName: string
  checkIn: string
  checkOut: string
  guests: number
  total: number
  safetyScore: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const initialHotels: Hotel[] = [
  { id: 1, name: "Ella Jungle Resort", location: "Ella, Sri Lanka", rating: 4.6, price: 120, risk: "Low", image: "/hero1.jpg" },
  { id: 2, name: "Hilltop Retreat", location: "Nuwara Eliya", rating: 4.2, price: 100, risk: "Medium", image: "/hero2.jpg" },
  { id: 3, name: "Beachfront Paradise", location: "Mirissa", rating: 4.8, price: 150, risk: "Low", image: "/hero3.jpg" },
  { id: 4, name: "Ella Flower Garden", location: "Ella, Sri Lanka", rating: 4.6, price: 120, risk: "Low", image: "/hero2.jpg" },
  { id: 5, name: "Ravana Pool Club", location: "Kandy", rating: 4.2, price: 100, risk: "Medium", image: "/hero1.jpg" },
  { id: 6, name: "Colombo City Suites", location: "Colombo", rating: 4.8, price: 150, risk: "Low", image: "/hero3.jpg" },
]

// ─── Risk config ──────────────────────────────────────────────────────────────

const RISK: Record<Risk, { pill: string; dot: string; label: string }> = {
  Low:    { pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",  dot: "bg-emerald-400", label: "Low risk" },
  Medium: { pill: "bg-amber-50  text-amber-700   border border-amber-200",     dot: "bg-amber-400",   label: "Medium risk" },
  High:   { pill: "bg-red-50    text-red-700     border border-red-200",       dot: "bg-red-400",     label: "High risk" },
}

// ─── HotelCard ────────────────────────────────────────────────────────────────

function HotelCard({
  hotel,
  defaultCheckIn,
  defaultCheckOut,
  onBookSuccess,
}: {
  hotel: Hotel
  defaultCheckIn?: string
  defaultCheckOut?: string
  onBookSuccess?: (b: Booking) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const cfg = RISK[hotel.risk]

  return (
    <>
      <Card
        className="group relative overflow-hidden rounded-2xl border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          {!imgErr ? (
            <Image
              src={hotel.image}
              alt={hotel.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100">
              <ShieldCheck className="w-8 h-8 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm bg-white/90 border ${cfg.pill.split(" ").slice(1).join(" ")}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-800">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {hotel.rating}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-[15px] font-semibold text-slate-900 leading-tight mb-1 truncate">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-[13px] text-slate-400 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{hotel.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-slate-900">${hotel.price}</span>
              <span className="text-[12px] text-slate-400 ml-1">/ night</span>
            </div>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl h-auto transition-all active:scale-95"
              onClick={(e) => { e.stopPropagation(); setModalOpen(true) }}
            >
              Book now
            </Button>
          </div>
        </CardContent>
      </Card>

      <HotelDetailModal
        hotel={hotel}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultCheckIn={defaultCheckIn}
        defaultCheckOut={defaultCheckOut}
        onBookSuccess={onBookSuccess}
      />
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type SortOption = "default" | "price-asc" | "price-desc" | "rating"
type RiskFilter = "All" | Risk

export default function HotelsPage() {
  const [hotels] = useState<Hotel[]>(initialHotels)
  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("All")
  const [maxPrice, setMaxPrice] = useState(300)
  const [sort, setSort] = useState<SortOption>("default")
  const [checkIn] = useState("")
  const [checkOut] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Handler: show booking success message and remove after 5 seconds
  const handleBookSuccess = (b: Booking) => {
    setBookings(prev => [...prev, b]);
    
    // Remove that booking message after 5 seconds
    setTimeout(() => {
      setBookings(prev => prev.filter(item => item !== b));
    }, 5000);
  }

  const filtered = useMemo(() => {
    let result = hotels.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.location.toLowerCase().includes(search.toLowerCase())
      const matchRisk = riskFilter === "All" || h.risk === riskFilter
      const matchPrice = h.price <= maxPrice
      return matchSearch && matchRisk && matchPrice
    })
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price)
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price)
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating)
    return result
  }, [hotels, search, riskFilter, maxPrice, sort])

  const RISK_FILTERS: RiskFilter[] = ["All", "Low", "Medium", "High"]

  return (
    <div className="min-h-screen bg-[#F7F6F3]">

      {/* Hero Section */}
      <section className="relative h-[62vh] flex items-end overflow-hidden bg-slate-900">
        <img
          src="/hero6.jpg"
          alt="hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Cpu className="w-3 h-3" />
              AI-powered travel safety platform
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none mb-4">
              SafeTravel<span className="text-white/40">.ai</span>
            </h1>
            <p className="text-white/60 text-lg max-w-md">
              AI-verified stays across Sri Lanka — real-time safety scores, wildlife alerts, and smart booking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 flex items-center gap-3 bg-white rounded-2xl p-2 shadow-2xl max-w-xl"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                className="w-full pl-9 pr-3 py-2.5 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                placeholder="Search by hotel or destination..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              className="flex-shrink-0 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-colors"
              onClick={() => document.getElementById("hotels-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              Search
            </button>
          </motion.div>
        </div>
      </section>

      <section id="hotels-section" className="max-w-7xl mx-auto px-6 pt-12 pb-24">

        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {filtered.length} properties
              </p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Signature Hotels</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 outline-none cursor-pointer hover:border-slate-300 transition-colors"
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                >
                  <option value="default">Sort: Default</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>

              <button
                onClick={() => setShowFilters(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Risk level</p>
                    <div className="flex gap-2 flex-wrap">
                      {RISK_FILTERS.map(r => (
                        <button
                          key={r}
                          onClick={() => setRiskFilter(r)}
                          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                            riskFilter === r
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px w-full sm:h-12 sm:w-px bg-slate-100" />

                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Max price / night</p>
                      <span className="text-sm font-bold text-slate-800">${maxPrice}</span>
                    </div>
                    <input
                      type="range"
                      min={70}
                      max={300}
                      step={10}
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-slate-900"
                    />
                  </div>

                  {(riskFilter !== "All" || maxPrice < 300) && (
                    <>
                      <div className="h-px w-full sm:h-12 sm:w-px bg-slate-100" />
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Active filters</p>
                        <div className="flex gap-2 flex-wrap">
                          {riskFilter !== "All" && (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                              onClick={() => setRiskFilter("All")}
                            >
                              {riskFilter} risk <X className="w-3 h-3" />
                            </span>
                          )}
                          {maxPrice < 300 && (
                            <span
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                              onClick={() => setMaxPrice(300)}
                            >
                              Max ${maxPrice} <X className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Search className="w-12 h-12 text-slate-200" />
            <div className="text-center">
              <p className="text-base font-semibold text-slate-700">No hotels found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
            </div>
            <button
              className="text-sm text-slate-500 underline underline-offset-2 hover:text-slate-800 transition-colors"
              onClick={() => { setSearch(""); setRiskFilter("All"); setMaxPrice(300) }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((hotel, i) => (
                <motion.div
                  key={hotel.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <HotelCard
                    hotel={hotel}
                    defaultCheckIn={checkIn}
                    defaultCheckOut={checkOut}
                    onBookSuccess={handleBookSuccess}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Bookings Summary Bar with Auto-Hide Logic */}
        <AnimatePresence>
          {bookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
            >
              <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {bookings.length} booking{bookings.length > 1 ? "s" : ""} confirmed
                </span>
                <span className="text-slate-400 text-xs">
                  — {bookings[bookings.length - 1].hotelName}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}