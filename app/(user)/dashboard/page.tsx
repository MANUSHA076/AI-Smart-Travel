"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { AlertTriangle,Hotel,Route,MapPin,Clock,Star} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import RoutePreviewMap from "@/components/ReusableMap"
import { useState } from "react"

interface AnalysisData {
  riskScore: number;
  safetyLevel: string;
  safeCity: string;
  summary: string;
  tips: string[];
}
export default function DashboardPage() {
  
   const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [travelMode, setTravelMode] = useState("");
    const [analysis, setAnalysis] = useState<AnalysisData | null>(null);

  return (
    <div className="p-6 space-y-6">

    <div>
       <p className="w-10 font-bold">OverView</p>

    </div>


    {/*Stats*/ }
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="hover:shadow-lg transition">
          <CardContent className=" p-4 flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 text-orange-500"/>
            <div>
              <p className="text-xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>

           
          </CardContent>

        </Card>




            <Card className="hover:shadow-lg transition">
          <CardContent className=" p-4 flex items-center gap-4">
            <Route className="h-8 w-8 text-blue-500"/>
            <div>
              <p className="text-xl font-bold">10</p>
              <p className="text-sm text-muted-foreground">Safe Route</p>
            </div>

           
          </CardContent>

        </Card>

          <Card className="hover:shadow-lg transition">
          <CardContent className=" p-4 flex items-center gap-4">
            <Hotel className="h-8 w-8 text-green-500"/>
            <div>
              <p className="text-xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Hotels Count</p>
            </div>

           
          </CardContent>

     </Card>
</div>

     
      
<Card className="overflow-hidden border-none shadow-none bg-transparent">
  <CardHeader className="px-0">
    <CardTitle className="text-xl">AI Recommended Route Map</CardTitle>
    <CardDescription>
      Visualizing the safest path from {from || "Start"} to {to || "Destination"}
    </CardDescription>
  </CardHeader>

  <CardContent className="px-0 pb-0">
    {/* මෙන්න මෙතනට තමයි අපි component එක දාන්නේ */}
    <RoutePreviewMap 
      from={from} 
      to={to} 
      travelMode={travelMode} 
      height="500px" 
    />
  </CardContent>
</Card>


<Card className="hover:shadow-md transition">
  <CardContent className="p-4 space-y-4">

    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        Safety Alerts
      </h2>
      <Button size="sm" variant="outline">
        View All
      </Button>
    </div>

    {/* Alerts List */}
    <div className="space-y-3">

      {/* Alert 1 */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <div>
            <p className="text-sm font-medium">
              Flood Risk
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Colombo
            </div>
          </div>
        </div>
        <Badge variant="destructive">High</Badge>
      </div>

      {/* Alert 2 */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="text-sm font-medium">
              Traffic Accident
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Kandy
            </div>
          </div>
        </div>
        <Badge variant="secondary">Medium</Badge>
      </div>

    </div>

  </CardContent>
</Card>

      <Card className="hover:shadow-md transition">
  <CardContent className="p-4 space-y-4">

    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        AI Routes
      </h2>
      <Button size="sm" variant="outline">
        View All
      </Button>
    </div>

    {/* Routes List */}
    <div className="space-y-3">

      {/* Route 1 */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center gap-3">
          <Route className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium">
              Colombo → Kandy
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              2h 30m
            </div>
          </div>
        </div>
        <Badge variant="secondary">Safe</Badge>
      </div>

      {/* Route 2 */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div className="flex items-center gap-3">
          <Route className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-sm font-medium">
              Galle → Matara
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              1h 10m
            </div>
          </div>
        </div>
        <Badge variant="secondary">Low Risk</Badge>
      </div>

    </div>

  </CardContent>
</Card>
       <Card className="hover:shadow-md transition">
  <CardContent className="p-4 space-y-4">

    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">
        Hotels
      </h2>
      <Button size="sm" variant="outline">
        View All
      </Button>
    </div>

    {/* Hotels List */}
    <div className="space-y-3">

      {/* Hotel 1 */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div>
          <p className="text-sm font-medium">
            Ella Jungle Resort
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Ella
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              4.6
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">$120</span>
          <Badge variant="secondary">Low</Badge>
        </div>
      </div>

      {/* Hotel 2 */}
      <div className="flex items-center justify-between p-3 border rounded-md">
        <div>
          <p className="text-sm font-medium">
            Beach Paradise
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Mirissa
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              4.8
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">$150</span>
          <Badge variant="secondary">Low</Badge>
        </div>
      </div>

    </div>

  </CardContent>
</Card>


    </div>
  )
}