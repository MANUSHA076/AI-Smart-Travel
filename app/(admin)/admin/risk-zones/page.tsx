"use client"
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('@/components/ReusableMap'), {
  ssr: false,
  loading: () => <p className="h-125 flex items-center justify-center bg-slate-100">Map Loading...</p>
})

interface RouteSummary {
  points: [number, number][]
  color: 'red' | 'green'
  distance: string
}

interface RiskZone {
  name: string
  riskLevel: 'High' | 'Medium' | 'Low'
  description?: string
  location: {
    lat: number
    lng: number
  }
}

type MapRiskLevel = 'low' | 'medium' | 'high'

interface OsrmRoute {
  geometry: {
    coordinates: [number, number][]
  }
  distance: number
}

export default function RiskZonesPage() {
  // --- States ---
  const [name, setName] = useState("")
  const [riskLevel, setRiskLevel] = useState("High")
  const [description, setDescription] = useState("")
  const [startCity, setStartCity] = useState("")
  const [endCity, setEndCity] = useState("")
  const [routes, setRoutes] = useState<RouteSummary[]>([]) // To store multiple routes
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const [savedZones, setSavedZones] = useState<RiskZone[]>([])

  const safetyPoints = savedZones.map((zone) => ({
    coordinate: [zone.location.lng, zone.location.lat] as [number, number],
    riskLevel: zone.riskLevel.toLowerCase() as MapRiskLevel,
    label: zone.name,
    description: zone.description,
  }))

  // 1. Function to fetch data from the database
  const fetchZones = async () => {
    try {
      const res = await fetch("/api/risk-zones");
      const data = await res.json();
      setSavedZones(data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetch("/api/risk-zones")
      .then((res) => res.json())
      .then((data: RiskZone[]) => {
        if (isMounted) setSavedZones(data);
      })
      .catch((error) => {
        console.error("Error fetching zones:", error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Function to find coordinates (lat/lng) by city name
  const getCoordinates = async (cityName: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`);
      const data = await res.json();
      return data && data.length > 0 ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null;
    } catch {
      return null;
    }
  };

  // 3. Haversine formula for distance calculation (in KM)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // 4. Function that finds 3 routes and checks their safety
  const handleFindRoute = async () => {
    if (!startCity || !endCity) return alert("please enter city names!");
    setIsRouteLoading(true);

    const start = await getCoordinates(startCity);
    const end = await getCoordinates(endCity);

    if (start && end) {
      // alternatives=true ,request 3 roads
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&alternatives=true`);
      const data = await res.json();

      if (data.routes) {
        const analyzedRoutes: RouteSummary[] = data.routes.map((routeObj: OsrmRoute) => {
          const coordinates = routeObj.geometry.coordinates;
          
          // Check whether any point on the route is within 1.5km of a High Risk Zone
          const hasRisk = coordinates.some((point: [number, number]) => 
            savedZones.some((zone) => {
              if (zone.riskLevel === "High") {
                const dist = calculateDistance(point[1], point[0], zone.location.lat, zone.location.lng);
                return dist < 1.5; 
              }
              return false;
            })
          );

          return {
            points: coordinates,
            color: hasRisk ? "red" : "green", 
            distance: (routeObj.distance / 1000).toFixed(2)
          };
        });
        setRoutes(analyzedRoutes);
      }
    } else {
      alert(" city not found!");
    }
    setIsRouteLoading(false);
  };

  // 5. Function to save a Risk Zone
  const handleSaveZone = async () => {
    if (!name) return alert("please enter a city name!");
    const coords = await getCoordinates(name);
    if (!coords) return alert(" city not found!");

    const res = await fetch("/api/risk-zones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, riskLevel, description, location: coords }),
    });

    if (res.ok) {
      alert(`${name} Marked Success ✅`);
      setName("");
      setDescription("");
      fetchZones();
    }
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-800">Admin AI Safety Control</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white p-2 rounded-xl shadow-md border">
            <MapWithNoSSR 
            multiRoutes={routes} // Passing an array
            height="650px" 
            safetyPoints={safetyPoints}
          />
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Form: Add Risk Zones */}
          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="font-semibold text-red-600 mb-3 underline">1. Add Danger Zone</h2>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Town (e.g. Badulla)" className="w-full p-2 border rounded mb-2" />
            <select value={riskLevel} onChange={(e)=>setRiskLevel(e.target.value)} className="w-full p-2 border rounded mb-3">
              <option value="High">High Risk (Landslide/Flood)</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="What happened? e.g. elephant crossing/ Floods/ Landslide"
              className="w-full p-2 border rounded mb-3 min-h-20"
            />
            <button onClick={handleSaveZone} className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">💾 SAVE ZONE</button>
          </div>

          {/* Form: Test Routes */}
          <div className="bg-white p-5 rounded-xl shadow border">
            <h2 className="font-semibold text-emerald-600 mb-3 underline">2. Analyze Path Safety</h2>
            <input type="text" value={startCity} onChange={(e)=>setStartCity(e.target.value)} placeholder="From (e.g. Colombo)" className="w-full p-2 border rounded mb-2" />
            <input type="text" value={endCity} onChange={(e)=>setEndCity(e.target.value)} placeholder="To (e.g. Badulla)" className="w-full p-2 border rounded mb-3" />
            <button onClick={handleFindRoute} className="w-full bg-emerald-600 text-white py-2 rounded font-bold hover:bg-emerald-700">
              {isRouteLoading ? "Analyzing..." : "🔍 CHECK 3 ROUTES"}
            </button>
          </div>

          {/* Route Info */}
          {routes.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow border">
              <h3 className="text-sm font-bold mb-2">Results:</h3>
              {routes.map((r, i) => (
                <div key={i} className={`p-2 mb-1 rounded text-xs font-medium ${r.color === 'red' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  Route {i+1}: {r.distance}km - {r.color === 'red' ? '⚠️ High Risk' : '✅ Safe'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}