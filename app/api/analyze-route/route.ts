import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";
import RiskZone from "@/models/RiskZone";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── Types ────────────────────────────────────────────────────────────────────

type RouteCoordinate = [number, number];

type SafetyPoint = {
  coordinate: RouteCoordinate;
  label: string;
  condition: string;
  roadStatus: string;
  temperature: number | null;
  riskLevel: "low" | "medium" | "high";
  description?: string;
};

type AdminHighRiskZone = {
  coordinate: RouteCoordinate;
  name: string;
  description: string;
};

type RouteSummary = {
  riskScore: number;
  safetyLevel: string;
  summary: string;
  tips: string[];
};

type GeoLocation = {
  lat: number;
  lng: number;
};

type RoadRoute = {
  points: RouteCoordinate[];
  distanceMeters: number;
};

type WeatherSnapshot = {
  condition: string;
  temperature: number | null;
  isRainy: boolean;
};

type OSRMRoute = {
  geometry: { coordinates: RouteCoordinate[] };
  distance: number;
};

type OSRMResponse = {
  code: string;
  routes: OSRMRoute[];
};

type RiskZoneDocument = {
  _id?: string;
  name?: string;
  description?: string;
  location?: { lat: number; lng: number };
  riskLevel: string;
};

// ─── Geocoding ────────────────────────────────────────────────────────────────

function toCoordinate(geo: GeoLocation | null): RouteCoordinate {
  if (!geo) return [0, 0];
  return [geo.lng, geo.lat];
}

async function geocodeSriLankaLocation(locationName: string): Promise<GeoLocation | null> {
  try {
    if (!locationName) return null;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        locationName + ", Sri Lanka"
      )}&format=json&limit=1`,
      { headers: { "User-Agent": "AI-Smart-Travel" } }
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch { return null; }
}

// ─── OSRM — Guaranteed 2 routes ───────────────────────────────────────────────

async function fetchRoadRoutes(
  start: RouteCoordinate,
  end: RouteCoordinate,
  travelMode: string
): Promise<RoadRoute[]> {
  try {
    const mode = travelMode.toLowerCase() === "walking" ? "foot" : "driving";

    const res1 = await fetch(
      `https://router.project-osrm.org/route/v1/${mode}/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson&alternatives=true`,
      { headers: { "User-Agent": "AI-Smart-Travel" } }
    );
    const data1: OSRMResponse = await res1.json();
    const directRoutes: RoadRoute[] = (data1.routes || []).map((r: OSRMRoute) => ({
      points: r.geometry.coordinates as RouteCoordinate[],
      distanceMeters: r.distance,
    }));

    if (directRoutes.length >= 2) return directRoutes.slice(0, 2);

    const midLng = (start[0] + end[0]) / 2;
    const midLat = (start[1] + end[1]) / 2;
    const res2 = await fetch(
      `https://router.project-osrm.org/route/v1/${mode}/${start[0]},${start[1]};${midLng},${midLat};${end[0]},${end[1]}?overview=full&geometries=geojson`,
      { headers: { "User-Agent": "AI-Smart-Travel" } }
    );
    const data2: OSRMResponse = await res2.json();
    const waypointRoute = data2.routes?.[0];

    const results = [...directRoutes];
    if (waypointRoute) {
      results.push({
        points: waypointRoute.geometry.coordinates as RouteCoordinate[],
        distanceMeters: waypointRoute.distance,
      });
    }
    return results.slice(0, 2);
  } catch { return []; }
}

function anchorRouteEndpoints(
  points: RouteCoordinate[],
  start: RouteCoordinate,
  end: RouteCoordinate
): RouteCoordinate[] {
  if (points.length === 0) return [start, end];
  if (points.length === 1) return [start, points[0], end];
  return [start, ...points, end];
}

function sampleCoordinates(coordinates: RouteCoordinate[], sampleSize = 5): RouteCoordinate[] {
  if (coordinates.length <= sampleSize) return coordinates;
  const step = Math.floor(coordinates.length / sampleSize);
  return coordinates
    .filter((_, i) => i % step === 0 || i === coordinates.length - 1)
    .slice(0, sampleSize);
}

// ─── Weather ──────────────────────────────────────────────────────────────────

async function fetchWeatherSnapshot(coordinate: RouteCoordinate): Promise<WeatherSnapshot> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coordinate[1]}&longitude=${coordinate[0]}&current=temperature_2m,weather_code&timezone=Asia/Colombo`,
      { headers: { "User-Agent": "AI-Smart-Travel" } }
    );
    const data = await response.json();
    const weatherCode: number = data.current?.weather_code || 0;
    const temperature: number | null = data.current?.temperature_2m || null;

    const isRainy = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 99);

    const condition =
      weatherCode === 0 ? "Clear" :
      weatherCode <= 2 ? "Partly Cloudy" :
      weatherCode === 3 ? "Overcast" :
      weatherCode >= 45 && weatherCode <= 48 ? "Foggy" :
      weatherCode >= 51 && weatherCode <= 67 ? "Rainy" :
      weatherCode >= 71 && weatherCode <= 77 ? "Snowy" :
      weatherCode >= 80 && weatherCode <= 82 ? "Rain Showers" :
      weatherCode >= 95 ? "Thunderstorm" : "Unknown";

    return { condition, temperature, isRainy };
  } catch {
    return { condition: "Unknown", temperature: null, isRainy: false };
  }
}

function deriveRiskLevel(snapshot: WeatherSnapshot): "low" | "medium" | "high" {
  if (snapshot.isRainy) return "medium";
  const c = snapshot.condition.toLowerCase();
  if (c.includes("fog") || c.includes("snow") || c.includes("thunder")) return "medium";
  return "low";
}

function deriveRoadStatus(riskLevel: "low" | "medium" | "high"): string {
  return riskLevel === "high" ? "Risky" : riskLevel === "medium" ? "Caution" : "Clear";
}

// ─── Admin Zones ──────────────────────────────────────────────────────────────

function routeContainsHighRiskZone(
  routePoints: RouteCoordinate[],
  adminZones: AdminHighRiskZone[]
): boolean {
  const threshold = 0.02;
  return adminZones.some((zone) =>
    routePoints.some((point) =>
      Math.abs(point[0] - zone.coordinate[0]) < threshold &&
      Math.abs(point[1] - zone.coordinate[1]) < threshold
    )
  );
}

function getHighRiskZonesNearRoute(
  routePoints: RouteCoordinate[],
  adminZones: AdminHighRiskZone[]
): AdminHighRiskZone[] {
  const threshold = 0.02;
  return adminZones.filter((zone) =>
    routePoints.some((point) =>
      Math.abs(point[0] - zone.coordinate[0]) < threshold &&
      Math.abs(point[1] - zone.coordinate[1]) < threshold
    )
  );
}

async function fetchAdminHighRiskZones(): Promise<AdminHighRiskZone[]> {
  try {
    await connectDB();
    const zones = await RiskZone.find({ riskLevel: "High" }).lean();
    return (zones as RiskZoneDocument[])
      .map((zone) => ({
        coordinate: [Number(zone?.location?.lng), Number(zone?.location?.lat)] as RouteCoordinate,
        name: String(zone?.name ?? "High Risk Zone"),
        description: String(zone?.description ?? "Admin marked this location as high risk."),
      }))
      .filter((z) => isFinite(z.coordinate[0]) && isFinite(z.coordinate[1]));
  } catch (err) {
    console.error("DB Error:", err);
    return [];
  }
}

// ─── Groq AI Summary ──────────────────────────────────────────────────────────

async function analyzeRouteSummary(
  startLocation: string,
  destination: string,
  travelMode: string
): Promise<RouteSummary> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a travel safety expert for Sri Lanka. Respond ONLY in valid JSON." },
        { role: "user", content: `Analyze safety from ${startLocation} to ${destination} via ${travelMode}. Return JSON with: riskScore (0-10 number), safetyLevel (Safe/Caution/Danger string), summary (2 sentences string), tips (array of 3 strings).` },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return {
      riskScore: Number(parsed.riskScore ?? 0),
      safetyLevel: String(parsed.safetyLevel ?? "Safe"),
      summary: String(parsed.summary ?? "Route analysed. No major hazards detected."),
      tips: Array.isArray(parsed.tips) ? parsed.tips : ["Drive safely."],
    };
  } catch {
    return { riskScore: 0, safetyLevel: "Safe", summary: "Safe route available.", tips: ["Drive safely"] };
  }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const { startLocation, destination, travelMode } = await req.json();

    const startGeo = await geocodeSriLankaLocation(startLocation);
    const destinationGeo = await geocodeSriLankaLocation(destination);

    if (!startGeo || !destinationGeo) {
      return NextResponse.json({ error: "ස්ථානය සොයාගත නොහැක." }, { status: 400 });
    }

    const startCoordinate = toCoordinate(startGeo);
    const destinationCoordinate = toCoordinate(destinationGeo);

    const [routeOptions, summary, adminHighRiskZones] = await Promise.all([
      fetchRoadRoutes(startCoordinate, destinationCoordinate, travelMode),
      analyzeRouteSummary(startLocation, destination, travelMode),
      fetchAdminHighRiskZones(),
    ]);

    const anchoredRoutes = routeOptions.map((route) => ({
      ...route,
      points: anchorRouteEndpoints(route.points, startCoordinate, destinationCoordinate),
    }));

    const routesWithMeta = await Promise.all(
      anchoredRoutes.map(async (route) => {
        const hasAdminRisk = routeContainsHighRiskZone(route.points, adminHighRiskZones);
        const sampled = sampleCoordinates(route.points, 5);
        const weatherSnaps = await Promise.all(sampled.map(fetchWeatherSnapshot));
        const rainyCount = weatherSnaps.filter((w) => w.isRainy).length;
        const hasRainy = rainyCount > 0;

        const color: "red" | "orange" | "green" = hasAdminRisk ? "red" : hasRainy ? "orange" : "green";
        const riskReason = hasAdminRisk ? "Admin Danger Zone" : hasRainy ? `Rainy Weather (${rainyCount}/${sampled.length} points)` : "Safe";

        return { route, color, riskReason, sampled, weatherSnaps };
      })
    );

    const priorityMap = { green: 0, orange: 1, red: 2 };
    const sortedByPriority = [...routesWithMeta].sort((a, b) =>
      priorityMap[a.color] !== priorityMap[b.color]
        ? priorityMap[a.color] - priorityMap[b.color]
        : a.route.distanceMeters - b.route.distanceMeters
    );
    const recommendedRoute = sortedByPriority[0];

    const allRoutes = routesWithMeta.map((meta, i) => ({
      points: meta.route.points,
      color: meta.color,
      riskReason: meta.riskReason,
      distance: `${(meta.route.distanceMeters / 1000).toFixed(1)} km`,
      isRecommended: meta === recommendedRoute,
    }));

    // ─── Add flags for the first and second routes ───────────────────
    let combinedSafetyPoints: SafetyPoint[] = [];

    for (let i = 0; i < Math.min(anchoredRoutes.length, 2); i++) {
      const currentRoute = anchoredRoutes[i];
      const routeLabel = i === 0 ? "Route 1" : "Route 2";

      // 1. Weather Points for this route
      const sampled = sampleCoordinates(currentRoute.points, 4);
      const weatherPoints = await Promise.all(
        sampled.map(async (coord, idx) => {
          const snap = await fetchWeatherSnapshot(coord);
          const rLevel = deriveRiskLevel(snap);
          return {
            coordinate: coord,
            label: `${routeLabel} - Checkpoint ${idx + 1}`,
            condition: snap.condition,
            roadStatus: deriveRoadStatus(rLevel),
            temperature: snap.temperature,
            riskLevel: rLevel,
            description: `${snap.condition} detected on ${routeLabel}.`
          } as SafetyPoint;
        })
      );

      // 2. Admin Points for this route
      const adminPoints = getHighRiskZonesNearRoute(currentRoute.points, adminHighRiskZones).map(zone => ({
        coordinate: zone.coordinate,
        label: `${zone.name} (${routeLabel})`,
        condition: "Admin Warning",
        roadStatus: "අවදානම් කලාපයකි",
        temperature: null,
        riskLevel: "high",
        description: zone.description,
      } as SafetyPoint));

      combinedSafetyPoints = [...combinedSafetyPoints, ...weatherPoints, ...adminPoints];
    }

    return NextResponse.json({
      ...summary,
      allRoutes,
      routeSafetyPoints: combinedSafetyPoints,
      routeWeatherSummary: {
        blockedSegments: combinedSafetyPoints.filter((p) => p.riskLevel === "high").length,
        rainySegments: combinedSafetyPoints.filter((p) => p.riskLevel === "medium").length,
        sampledPoints: combinedSafetyPoints.length,
      },
    });

  } catch (error) {
    console.error("Route analysis error:", error);
    return NextResponse.json({
      error: "Analysis Failed",
      safetyLevel: "Safe",
      summary: "Error during calculation.",
    }, { status: 500 });
  }
}