"use client"

import { useState } from "react";
import { Route, MapPin, Navigation, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import RoutePreviewMap from "@/components/ReusableMap";

interface AnalysisData {
  riskScore: number;
  safetyLevel: string;
  safeCity: string;
  summary: string;
  tips: string[];
  // ✅ MapLibre සඳහා අලුතින් එකතු කළ Coordinates array එක
  routeCoordinates?: [number, number][]; 
}

export default function RoutesPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelMode, setTravelMode] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!from || !to || !travelMode) return alert("Please fill all fields");

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
    } catch (error) {
      console.error("Error connecting to AI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Route className="h-8 w-8 text-primary" />
          AI Route Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Find the safest and smartest route using AI insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Input Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-500" /> From</Label>
                <Input placeholder="e.g. Colombo" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Navigation className="h-4 w-4 text-blue-500" /> To</Label>
                <Input placeholder="e.g. Kandy" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Travel Mode</Label>
                <Select value={travelMode} onValueChange={setTravelMode}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bus">Bus</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="walk">Walking</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleAnalyze} disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  "Analyze Route"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Result Summary */}
        <div className="space-y-6">
          {!analysis ? (
             <Card className="h-full border-dashed flex flex-col items-center justify-center p-10 text-center text-muted-foreground">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Route className="h-10 w-10 opacity-20" />
                </div>
                <p>Enter details and click analyze to see AI route suggestions</p>
             </Card>
          ) : (
            <Card className="animate-in fade-in slide-in-from-bottom-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">AI Insight</CardTitle>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysis.riskScore <= 4 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {analysis.safetyLevel.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg text-sm leading-relaxed">
                  {analysis.summary}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold flex items-center gap-2">🛡️ Safety Tips:</p>
                  <ul className="grid grid-cols-1 gap-2">
                    {analysis.tips.map((tip, i) => (
                      <li key={i} className="text-xs bg-primary/5 p-2 rounded border-l-4 border-primary">{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ✅ Full Width MapLibre Section */}
      <Card className="overflow-hidden shadow-lg border-2">
        <CardHeader className="bg-muted/50 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
             <Navigation className="h-5 w-5" /> Live Route Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* ප්‍රධාන වෙනස: 
              දැන් අපි දෙන්නේ coordinates ටික. 
              Analysis එකක් නැති වෙලාවට null යනවා. 
          */}
          <RoutePreviewMap 
            routeData={analysis?.routeCoordinates || null} 
            height="500px" 
          />
        </CardContent>
      </Card>
    </div>
  )
}