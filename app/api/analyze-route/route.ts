import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

type RouteCoordinate = [number, number];

type SafetyPoint = {
  coordinate: RouteCoordinate;
  label: string;
  condition: string;
  roadStatus: string;
  temperature: number | null;
  riskLevel: "low" | "medium" | "high";
};

type WeatherSnapshot = {
  temperature: number;
  precipitation: number;
  weatherCode: number;
  condition: string;
};

type GeoLocation = {
  latitude: number;
  longitude: number;
  name: string;
};

type RouteSummary = {
  riskScore: number;
  safetyLevel: string;
  summary: string;
  tips: string[];
};

const weatherCodeMap: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

function normalizeSriLankaRoute(points: RouteCoordinate[]): RouteCoordinate[] {
  return points.filter(([longitude, latitude]) => {
    return longitude >= 79 && longitude <= 82 && latitude >= 5 && latitude <= 10;
  });
}

function createFallbackRoute(start: RouteCoordinate, destination: RouteCoordinate, pointCount = 16): RouteCoordinate[] {
  const midLongitude = (start[0] + destination[0]) / 2;
  const midLatitude = (start[1] + destination[1]) / 2;
  const deltaLongitude = destination[0] - start[0];
  const deltaLatitude = destination[1] - start[1];
  const curveOffset = Math.max(0.12, Math.min(0.45, Math.hypot(deltaLongitude, deltaLatitude) * 0.18));
  const controlLongitude = midLongitude - deltaLatitude * curveOffset;
  const controlLatitude = midLatitude + deltaLongitude * curveOffset;

  const route: RouteCoordinate[] = [];

  for (let index = 0; index < pointCount; index++) {
    const t = index / (pointCount - 1);
    const oneMinusT = 1 - t;
    const longitude = oneMinusT * oneMinusT * start[0] + 2 * oneMinusT * t * controlLongitude + t * t * destination[0];
    const latitude = oneMinusT * oneMinusT * start[1] + 2 * oneMinusT * t * controlLatitude + t * t * destination[1];
    route.push([longitude, latitude]);
  }

  return route;
}

function anchorRouteEndpoints(points: RouteCoordinate[], start: RouteCoordinate, destination: RouteCoordinate): RouteCoordinate[] {
  if (points.length === 0) {
    return createFallbackRoute(start, destination);
  }

  const normalized = normalizeSriLankaRoute(points);

  if (normalized.length < 2) {
    return createFallbackRoute(start, destination);
  }

  const anchored = [...normalized];
  anchored[0] = start;
  anchored[anchored.length - 1] = destination;

  return anchored;
}

async function geocodeSriLankaLocation(locationName: string): Promise<GeoLocation | null> {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json&countryCode=LK`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const result = data?.results?.[0];

  if (!result) {
    return null;
  }

  return {
    latitude: Number(result.latitude),
    longitude: Number(result.longitude),
    name: result.name || locationName,
  };
}

function toCoordinate(location: GeoLocation): RouteCoordinate {
  return [location.longitude, location.latitude];
}

function getRoutingProfile(travelMode: string) {
  switch (travelMode) {
    case "walk":
      return "foot";
    case "bike":
      return "bike";
    case "bus":
    case "train":
    case "car":
    default:
      return "driving";
  }
}

async function fetchRoadRoute(
  startCoordinate: RouteCoordinate,
  destinationCoordinate: RouteCoordinate,
  travelMode: string
): Promise<RouteCoordinate[]> {
  const profile = getRoutingProfile(travelMode);
  const response = await fetch(
    `https://router.project-osrm.org/route/v1/${profile}/${startCoordinate[0]},${startCoordinate[1]};${destinationCoordinate[0]},${destinationCoordinate[1]}?overview=full&geometries=geojson&steps=false&alternatives=false`,
    { next: { revalidate: 900 } }
  );

  if (!response.ok) {
    throw new Error("Road routing lookup failed");
  }

  const data = await response.json();
  const coordinates = data?.routes?.[0]?.geometry?.coordinates;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    throw new Error("No road route returned");
  }

  return coordinates
    .filter((point: unknown): point is [number, number] => Array.isArray(point) && point.length >= 2)
    .map(([longitude, latitude]) => [Number(longitude), Number(latitude)] as RouteCoordinate)
    .filter(([longitude, latitude]) => Number.isFinite(longitude) && Number.isFinite(latitude));
}

async function analyzeRouteSummary(startLocation: string, destination: string, travelMode: string): Promise<RouteSummary> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a travel safety expert specialized in Sri Lankan geography. You must respond ONLY in a valid JSON format."
      },
      {
        role: "user",
        content: `Analyze travel safety from ${startLocation} to ${destination} in Sri Lanka using ${travelMode}. 
Return a JSON object with: 
"riskScore": (number), 
"safetyLevel": (string), 
"summary": (string), 
"tips": (array of short strings). 
Do not include route coordinates.`
      },
    ],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");

  return {
    riskScore: Number(parsed.riskScore ?? 5),
    safetyLevel: String(parsed.safetyLevel ?? "medium"),
    summary: String(parsed.summary ?? "Route analyzed with limited safety data."),
    tips: Array.isArray(parsed.tips) ? parsed.tips.map((tip: unknown) => String(tip)) : [],
  };
}

function sampleCoordinates(points: RouteCoordinate[], maxPoints = 6): RouteCoordinate[] {
  if (points.length <= maxPoints) {
    return points;
  }

  const sampled: RouteCoordinate[] = [];
  const step = Math.max(1, Math.floor(points.length / (maxPoints - 1)));

  for (let index = 0; index < points.length; index += step) {
    sampled.push(points[index]);
    if (sampled.length === maxPoints - 1) {
      break;
    }
  }

  sampled.push(points[points.length - 1]);
  return sampled;
}

function describeWeatherCode(code: number): string {
  return weatherCodeMap[code] || "Unknown conditions";
}

function deriveRiskLevel(snapshot: WeatherSnapshot): SafetyPoint["riskLevel"] {
  const severeRain = snapshot.precipitation >= 8 || [65, 67, 82, 95, 96, 99].includes(snapshot.weatherCode);
  const wetRoad = snapshot.precipitation > 0 || [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(snapshot.weatherCode);

  if (severeRain) {
    return "high";
  }

  if (wetRoad) {
    return "medium";
  }

  return "low";
}

function deriveRoadStatus(riskLevel: SafetyPoint["riskLevel"]) {
  if (riskLevel === "high") {
    return "Possible blockage or flooded stretch";
  }

  if (riskLevel === "medium") {
    return "Wet road, drive carefully";
  }

  return "Clear road conditions";
}

async function fetchWeatherSnapshot([longitude, latitude]: RouteCoordinate): Promise<WeatherSnapshot> {
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code&timezone=auto`,
    { next: { revalidate: 900 } }
  );

  if (!weatherResponse.ok) {
    throw new Error("Weather lookup failed");
  }

  const weatherData = await weatherResponse.json();
  const current = weatherData.current ?? {};
  const weatherCode = Number(current.weather_code ?? 0);
  const precipitation = Number(current.precipitation ?? 0);
  const temperature = Number(current.temperature_2m ?? 0);

  return {
    temperature,
    precipitation,
    weatherCode,
    condition: describeWeatherCode(weatherCode),
  };
}

export async function POST(req: Request) {
  try {
    const { startLocation, destination, travelMode } = await req.json();
    const startGeo = await geocodeSriLankaLocation(startLocation);
    const destinationGeo = await geocodeSriLankaLocation(destination);
    const startCoordinate = startGeo ? toCoordinate(startGeo) : null;
    const destinationCoordinate = destinationGeo ? toCoordinate(destinationGeo) : null;

    if (!startCoordinate || !destinationCoordinate) {
      return NextResponse.json({ error: "Location lookup failed", details: "Could not resolve one or both places in Sri Lanka." }, { status: 400 });
    }

    const [routeCoordinates, summary] = await Promise.all([
      fetchRoadRoute(startCoordinate, destinationCoordinate, travelMode),
      analyzeRouteSummary(startLocation, destination, travelMode),
    ]);

    const anchoredRouteCoordinates = anchorRouteEndpoints(routeCoordinates, startCoordinate, destinationCoordinate);
    const sampledCoordinates = sampleCoordinates(anchoredRouteCoordinates);

    const routeSafetyPoints = await Promise.all(
      sampledCoordinates.map(async (coordinate, index) => {
        try {
          const snapshot = await fetchWeatherSnapshot(coordinate);
          const riskLevel = deriveRiskLevel(snapshot);

          return {
            coordinate,
            label: `Checkpoint ${index + 1}`,
            condition: snapshot.condition,
            roadStatus: deriveRoadStatus(riskLevel),
            temperature: snapshot.temperature,
            riskLevel,
          } satisfies SafetyPoint;
        } catch {
          return {
            coordinate,
            label: `Checkpoint ${index + 1}`,
            condition: "Weather data unavailable",
            roadStatus: "Unable to assess road conditions",
            temperature: null,
            riskLevel: "medium",
          } satisfies SafetyPoint;
        }
      })
    );

    const blockedSegments = routeSafetyPoints.filter((point) => point.riskLevel === "high").length;
    const rainySegments = routeSafetyPoints.filter((point) => point.riskLevel === "medium").length;

    console.log("Road route coordinates:", anchoredRouteCoordinates);

    return NextResponse.json({
      ...summary,
      routeCoordinates: anchoredRouteCoordinates,
      routeSafetyPoints,
      routeWeatherSummary: {
        blockedSegments,
        rainySegments,
        sampledPoints: routeSafetyPoints.length,
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Analysis Failed", details: errorMessage }, { status: 500 });
  }
}
