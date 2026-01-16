"use client"

import { useState } from "react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  AlertTriangle,
  MapPin,
  Map,
} from "lucide-react"

/* ---------------- MOCK DATA ---------------- */

const alerts = [
  {
    id: 1,
    title: "Flood Warning",
    location: "Colombo – Kandy Road",
    description:
      "Heavy rainfall detected. Possible flooding in low-lying areas.",
    risk: "High",
  },
  {
    id: 2,
    title: "Landslide Risk",
    location: "Badulla District",
    description:
      "Soil instability detected after continuous rain.",
    risk: "Medium",
  },
  {
    id: 3,
    title: "Traffic Disruption",
    location: "Southern Expressway",
    description:
      "Accident reported. Expect traffic delays.",
    risk: "Low",
  },
]

/* ---------------- RISK BADGE ---------------- */

function RiskBadge({ risk }: { risk: string }) {
  const styles: any = {
    High: "bg-red-500 text-white",
    Medium: "bg-orange-500 text-white",
    Low: "bg-green-500 text-white",
  }

  return <Badge className={styles[risk]}>{risk} Risk</Badge>
}

/* ---------------- ALERT CARD ---------------- */

function AlertCard({
  alert,
  onOpen,
}: {
  alert: any
  onOpen: () => void
}) {
  return (
    <Card className="hover:shadow-lg transition">

      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-base">{alert.title}</CardTitle>
        </div>
        <RiskBadge risk={alert.risk} />
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {alert.location}
        </div>

        <p className="text-sm line-clamp-2">
          {alert.description}
        </p>
      </CardContent>

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={onOpen}
        >
          View Details
        </Button>
      </CardFooter>

    </Card>
  )
}

/* ---------------- MAP PREVIEW ---------------- */

function MapPreview() {
  return (
    <div className="
      h-48
      rounded-lg
      border
      flex
      items-center
      justify-center
      bg-muted
      text-muted-foreground
    ">
      <div className="flex flex-col items-center gap-2">
        <Map className="h-8 w-8" />
        <span className="text-sm">Map Preview (Coming Soon)</span>
      </div>
    </div>
  )
}

/* ---------------- PAGE ---------------- */

export default function AlertsPage() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null)

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Safety Alerts</h1>
          <p className="text-sm text-muted-foreground">
            Location-based safety information for travelers
          </p>
        </div>

        {/* Grid */}
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onOpen={() => setSelectedAlert(alert)}
            />
          ))}
        </div>
      </div>

      {/* MODAL */}
      <Dialog
        open={!!selectedAlert}
        onOpenChange={() => setSelectedAlert(null)}
      >
        <DialogContent className="max-w-lg">
          {selectedAlert && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  {selectedAlert.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <RiskBadge risk={selectedAlert.risk} />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {selectedAlert.location}
                </div>

                <p className="text-sm">
                  {selectedAlert.description}
                </p>

                {/* MAP */}
                <MapPreview />

                <Button
                  className="w-full"
                  onClick={() => setSelectedAlert(null)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
