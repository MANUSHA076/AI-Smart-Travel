import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Route, MapPin, Navigation } from "lucide-react"

export default function RoutesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Route className="h-6 w-6 text-primary" />
          AI Route Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Find the safest and smartest route using AI insights
        </p>
      </div>

      {/* Route Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>Route Details</CardTitle>
          <CardDescription>
            Enter your journey information to analyze safety & efficiency
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* From */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              From
            </Label>
            <Input placeholder="Starting location" />
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              To
            </Label>
            <Input placeholder="Destination" />
          </div>

          {/* Travel Mode */}
          <div className="space-y-2">
            <Label>Travel Mode</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select travel mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="car">Car</SelectItem>
                <SelectItem value="bike">Bike</SelectItem>
                <SelectItem value="walk">Walking</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="train">Train</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Button */}
          <Button className="w-full">
            Analyze Route
          </Button>

        </CardContent>
      </Card>
      {/* Route Result */}
<Card>
  <CardHeader>
    <CardTitle>Route Analysis Result</CardTitle>
    <CardDescription>
      AI evaluated the safest available route
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-4">

    {/* Risk Badge */}
    <div className="flex items-center gap-3">
      <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 font-medium">
        LOW RISK
      </span>
      <span className="text-muted-foreground">
        High safety confidence
      </span>
    </div>

    {/* Route Stats */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-3 border rounded-md">
        <p className="text-sm text-muted-foreground">Distance</p>
        <p className="font-semibold">12.4 km</p>
      </div>

      <div className="p-3 border rounded-md">
        <p className="text-sm text-muted-foreground">Estimated Time</p>
        <p className="font-semibold">35 minutes</p>
      </div>
    </div>

    {/* Reason */}
    <div className="p-4 bg-muted rounded-md">
      <p className="text-sm">
        This route uses main roads with better lighting and lower crime reports.
      </p>
    </div>

  </CardContent>
</Card>


      {/* Placeholder for Results */}
      <Card className="border-dashed">
        <CardContent className="py-10 text-center text-muted-foreground">
          AI route results will appear here after analysis
        </CardContent>
        </Card>
        
        {/* Map Preview */}
<Card className="overflow-hidden">
  <CardHeader>
    <CardTitle>Route Map Preview</CardTitle>
    <CardDescription>
      Visual representation of the recommended route
    </CardDescription>
  </CardHeader>

  <CardContent>
    <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted text-muted-foreground">
      🗺 Map preview will be displayed here
    </div>
  </CardContent>
</Card>


    </div>
  )
}
