"use client"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import HotelDetailModal from "@/components/HotelDetailModal"
import { MapPin, Star } from "lucide-react"

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


const hotels: Hotel[] = [
  {
    id: 1,
    name: "Ella Jungle Resort",
    location: "Ella, Sri Lanka",
    rating: 4.6,
    price: 120,
    risk: "Low",
    image: "/hero1.jpg",
  },
  {
    id: 2,
    name: "Hilltop Retreat",
    location: "Nuwara Eliya",
    rating: 4.2,
    price: 100,
    risk: "Medium",
    image: "/hero2.jpg",
  },
  {
    id: 3,
    name: "Beachfront Paradise",
    location: "Mirissa",
    rating: 4.8,
    price: 150,
    risk: "Low",
    image: "/hero3.jpg",
  },
  {
    id: 4,
    name: "Ella Flower garden",
    location: "Ella, Sri Lanka",
    rating: 4.6,
    price: 120,
    risk: "Low",
    image: "/hero2.jpg",
  },
  {
    id: 5,
    name: "Ravana pool club",
    location: "Kandy",
    rating: 4.2,
    price: 100,
    risk: "Medium",
    image: "/hero1.jpg",
  },
  {
    id: 6,
    name: "Beachfront Paradise",
    location: "colombo",
    rating: 4.8,
    price: 150,
    risk: "Low",
    image: "/hero3.jpg",
  },
]

// 2. CARD COMPONENT - එක හෝටල් කාඩ් එකක්
function HotelCard({ 
  hotel, 
  defaultCheckIn, 
  defaultCheckOut,
  onBookSuccess 
}: { 
  hotel: Hotel
  defaultCheckIn?: string
  defaultCheckOut?: string
  onBookSuccess?: (booking: Booking) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="hover:shadow-2xl transition-transform duration-300 cursor-pointer rounded-xl overflow-hidden bg-white">
        <div className="relative h-56 w-full">
          <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4" /> {hotel.location}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-400" /> {hotel.rating}
          </div>
          <Badge
            variant="outline"
            className={`${
              hotel.risk === "Low" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            } rounded-full px-2 py-1 text-xs`}
          >
            Risk: {hotel.risk}
          </Badge>
          <div className="flex items-center justify-between pt-2">
            <span className="font-medium text-gray-800">${hotel.price} / night</span>
            <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsModalOpen(true)}
            >
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Modal with booking & payment */}
      <HotelDetailModal 
        hotel={hotel} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        defaultCheckIn={defaultCheckIn}
        defaultCheckOut={defaultCheckOut}
        onBookSuccess={onBookSuccess}
      />
    </>
  )
}

// 3. MAIN PAGE - මුළු පේජ් එකම
export default function HotelsPage() {
  const [locationFilter, setLocationFilter] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const filteredHotels = hotels.filter(hotel =>
    hotel.location.toLowerCase().includes(locationFilter.toLowerCase())
  )

  const handleBookSuccess = (booking: Booking) => {
    setBookings([...bookings, booking]);
    console.log("Booking confirmed:", booking);
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Hotels</h1>
        <p className="text-sm text-gray-500 font-medium">Find safe & AI-verified hotels</p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
        <input
          placeholder="Location"
          className="w-[200px] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          value={locationFilter} 
          onChange={(e)=>setLocationFilter(e.target.value)} 
        />
        <input
          type="date"
          className="w-[160px] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          value={checkIn} 
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <input
          type="date"
          className="w-[160px] p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
          value={checkOut} 
          onChange={(e) => setCheckOut(e.target.value)}
        />
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">Search Hotels</Button>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map(hotel => (
          <HotelCard 
            key={hotel.id} 
            hotel={hotel}
            defaultCheckIn={checkIn}
            defaultCheckOut={checkOut}
            onBookSuccess={handleBookSuccess}
          />
        ))}
      </div>
    </div>
  )
}