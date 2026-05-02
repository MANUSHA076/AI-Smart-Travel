"use client"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Hotel = {
  id: number
  name: string
  location: string
  rating: number
  price: number
  risk: "Low" | "Medium" | "High"
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

const TAX_RATE = 0.12

function getSafetyConfig(risk: Hotel["risk"]) {
  switch (risk) {
    case "Low":
      return { score: 92, color: "text-green-600", bg: "bg-green-50", bar: "bg-green-500", label: "Highly safe area", badge: "bg-green-100 text-green-800", dot: "bg-green-500" }
    case "Medium":
      return { score: 68, color: "text-yellow-600", bg: "bg-yellow-50", bar: "bg-yellow-400", label: "Medium risk area", badge: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400" }
    case "High":
      return { score: 40, color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500", label: "High risk area", badge: "bg-red-100 text-red-800", dot: "bg-red-500" }
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-200"}`}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}

function GuestCounter({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-xl font-light transition-colors"
        aria-label="Decrease guests"
      >
        −
      </button>
      <span className="flex-1 text-center text-sm font-medium text-gray-800">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(10, value + 1))}
        className="w-10 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-xl font-light transition-colors"
        aria-label="Increase guests"
      >
        +
      </button>
    </div>
  )
}

export default function HotelDetailModal({
  hotel,
  isOpen,
  onClose,
  defaultCheckIn,
  defaultCheckOut,
  onBookSuccess,
}: {
  hotel: Hotel
  isOpen: boolean
  onClose: () => void
  defaultCheckIn?: string
  defaultCheckOut?: string
  onBookSuccess?: (booking: Booking) => void
}) {
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(1)
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setCheckIn(defaultCheckIn || "")
      setCheckOut(defaultCheckOut || "")
      setGuests(1)
      setBooked(false)
    }
  }, [isOpen, defaultCheckIn, defaultCheckOut])

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
  }, [checkIn, checkOut])

  const safety = getSafetyConfig(hotel.risk)
  const subtotal = hotel.price * nights * guests
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax
  const datesValid = nights > 0

  async function handlePayment() {
    if (!datesValid) {
      alert("⚠️ Please select valid check-in and check-out dates.")
      return
    }

    setLoading(true)

    try {
      // 👉 Connect Stripe / PayHere here
      await new Promise((res) => setTimeout(res, 1600))

      setBooked(true)

      onBookSuccess?.({
        hotelId: hotel.id,
        hotelName: hotel.name,
        checkIn,
        checkOut,
        guests,
        total,
        safetyScore: safety.score,
      })
    } catch {
      alert("❌ Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl">
        {booked ? (
          <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">✓</div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Booking Confirmed!</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {hotel.name} · {nights} night{nights !== 1 ? "s" : ""} · {guests} guest{guests !== 1 ? "s" : ""}
              </p>
              <p className="text-base font-semibold text-gray-900 mt-2">Total paid: ${total}</p>
            </div>
            <Button onClick={onClose} className="mt-2 w-full">Close</Button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{hotel.name}</h2>
                <p className="text-sm text-gray-500">{hotel.location}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-gray-900">${hotel.price}</div>
                <div className="text-xs text-gray-400">per night</div>
              </div>
            </div>

            <div className={`rounded-xl p-3 ${safety.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Location Safety</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${safety.badge}`}>
                  {safety.label}
                </span>
              </div>
              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${safety.bar}`}
                  style={{ width: `${safety.score}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>{safety.score}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guests</label>
                <GuestCounter value={guests} onChange={setGuests} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nights</label>
                <div className="flex items-center h-10 border border-gray-100 bg-gray-50 rounded-lg px-3 text-sm text-gray-700">
                  {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "—"}
                </div>
              </div>
            </div>

            {datesValid && (
              <div className="bg-gray-50 rounded-xl p-3.5 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>${hotel.price} × {nights} night{nights !== 1 ? "s" : ""} × {guests} guest{guests !== 1 ? "s" : ""}</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxes & fees (12%)</span>
                  <span>${tax}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-2xl font-semibold text-gray-900">
                  {datesValid ? `$${total}` : "$—"}
                </div>
                <div className="text-xs text-gray-400">
                  {datesValid ? "incl. taxes & fees" : "Select dates to see price"}
                </div>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading || !datesValid}
                size="lg"
                className="min-w-[130px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Pay Now 💳"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}