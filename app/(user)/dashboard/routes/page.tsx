"use client"

import { useState } from "react";
import { Route, MapPin, Navigation, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import RoutePreviewMap from "@/components/ReusableMap";

// Updated interface to support multiple routes
interface AnalysisData {
  riskScore: number;
  safetyLevel: string;
  safeCity: string;
  summary: string;
  tips: string[];
  // Now a list of routes can be provided instead of a single route
  allRoutes?: {
    points: [number, number][];
    color: "red" | "green" | "orange";
    distance?: string;
    riskReason?: string;
    isRecommended: boolean;
  }[];
  routeSafetyPoints?: {
    coordinate: [number, number];
    label: string;
    condition: string;
    roadStatus: string;
    temperature: number | null;
    riskLevel: "low" | "medium" | "high";
    description?: string; // Newly added description field
  }[];
  routeWeatherSummary?: {
    blockedSegments: number;
    rainySegments: number;
    sampledPoints: number;
  };
}

export default function RoutesPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelMode, setTravelMode] = useState("car");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!from || !to) return alert("Please enter both locations");

    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          startLocation: from, 
          destination: to, 
          travelMode: travelMode 
        }),
      });

      const data = await response.json();
      setAnalysis(data);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "latestRouteAnalysis",
          JSON.stringify({
            ...data,
            travelMode,
          })
        );
      }
    } catch (error) {
      console.error("Error connecting to AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const routeBadge = (route: NonNullable<AnalysisData["allRoutes"]>[number]) => {
    if (route.color === "red") {
      return {
        cls: "bg-red-100 text-red-700 border border-red-300",
        icon: "⚠️",
        label: `High Risk${route.riskReason ? ` · ${route.riskReason}` : ""}`,
      };
    }

    if (route.color === "orange") {
      return {
        cls: "bg-orange-100 text-orange-700 border border-orange-300",
        icon: "🌧️",
        label: `Medium Risk${route.riskReason ? ` · ${route.riskReason}` : ""}`,
      };
    }

    return {
      cls: "bg-green-100 text-green-700 border border-green-300",
      icon: "✅",
      label: "Safe Route",
    };
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Route className="h-8 w-8 text-primary" />
            AI Safety Route Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyzing real-time disaster zones and weather for your safety.
          </p>
        </div>
        {analysis && (
          <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 font-bold ${
            analysis.riskScore > 5 ? "border-red-500 bg-red-50 text-red-700" : "border-green-500 bg-green-50 text-green-700"
          }`}>
            {analysis.riskScore > 5 ? <AlertTriangle /> : <CheckCircle2 />}
            {(analysis.safetyLevel ?? "UNKNOWN").toUpperCase()} STATUS
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Controls & Results */}
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Plan Your Trip</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> Start Point</Label>
                <Input placeholder="City or Place" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Navigation className="h-4 w-4 text-blue-500" /> Destination</Label>
                <Input placeholder="Target Destination" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Travel Mode</Label>
                <Select value={travelMode} onValueChange={setTravelMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">🚗 Car / Van</SelectItem>
                    <SelectItem value="bus">🚌 Public Bus</SelectItem>
                    <SelectItem value="bike">🏍️ Motorbike</SelectItem>
                    <SelectItem value="walk">🚶 Walking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full font-bold h-12" onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 animate-spin" /> ANALYZING...</> : "SEARCH SAFE ROUTES"}
              </Button>
            </CardContent>
          </Card>

          {analysis?.allRoutes && analysis.allRoutes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Route Analysis Results
              </h3>

              {analysis.allRoutes.map((route, i) => {
                const badge = routeBadge(route);
                const distLabel = route.distance
                  ? route.distance.toString().includes("km")
                    ? route.distance
                    : `${route.distance} km`
                  : "N/A";

                return (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border-2 ${
                      route.isRecommended ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-black text-slate-300">{i + 1}</div>
                        <div>
                          <p className="font-semibold text-sm">
                            Route {i + 1}
                            {route.isRecommended && (
                              <span className="ml-2 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-bold">
                                RECOMMENDED
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${badge.cls}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 pl-11">
                      <span className="text-sm font-semibold text-slate-700">📍 {distLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {analysis && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-md">AI Travel Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p className="leading-relaxed italic">{analysis.summary}</p>
                <div className="space-y-2">
                  <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Safety Tips:</p>
                  {analysis.tips.map((tip, i) => (
                    <div key={i} className="flex gap-2 items-start bg-white p-2 rounded border shadow-sm text-xs">
                      <span className="text-primary font-bold">•</span> {tip}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side: Map & Details */}
        <div className="space-y-6">
          {/* Map Section */}
          <Card className="overflow-hidden shadow-2xl border-2 border-slate-200">
            <div className="bg-slate-900 text-white p-3 flex justify-between items-center text-sm font-medium">
              <span className="flex items-center gap-2"><Navigation className="h-4 w-4" /> Live Map Preview</span>
              {analysis && <span className="text-slate-400">{analysis.allRoutes?.length} routes identified</span>}
            </div>
            <CardContent className="p-0 relative">
              <RoutePreviewMap 
                // Here we directly provide the allRoutes array coming from the backend
                multiRoutes={analysis?.allRoutes || []}
                safetyPoints={analysis?.routeSafetyPoints || []}
                travelMode={travelMode}
                height="600px" 
              />
              
              {/* Route Legend Overlay */}
              {analysis && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border text-xs space-y-2 z-1000">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1.5 bg-green-500 rounded"></div> <span>Safe Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1.5 bg-red-500 rounded"></div> <span>Danger Area Included</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Checkpoints Grid */}
          {analysis?.routeSafetyPoints && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {analysis.routeSafetyPoints.map((point, index) => (
                 <Card key={index} className="overflow-hidden border-l-4 border-l-primary">
                    <CardContent className="p-4">
                       <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm">{point.label}</h4>
                            <p className="text-xs text-muted-foreground">{point.roadStatus}</p>
                          </div>
                          <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            point.riskLevel === 'high' ? 'bg-red-100 text-red-600' : point.riskLevel === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {(point.riskLevel ?? '').toUpperCase()}
                          </div>
                       </div>
                       <p className="text-[11px] mt-2 text-slate-600">{point.description}</p>
                    </CardContent>
                 </Card>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}