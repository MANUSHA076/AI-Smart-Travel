import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import RiskZone from "@/models/RiskZone";

export async function GET() {
    try {
        await connectDB();
    // Fetch all zones sorted by newest first, then keep only the latest per location name
    const riskZones = await RiskZone.find({}).sort({ createdAt: -1 });
    const dedup = new Map<string, any>();
    for (const z of riskZones) {
      const key = (z.name || "").toString().toLowerCase().trim();
      if (!dedup.has(key)) dedup.set(key, z);
    }
    const uniqueZones = Array.from(dedup.values());
    return NextResponse.json(uniqueZones, { status: 200 });

    }catch {
        return NextResponse.json({ error: "Failed to fetch risk zones" },
             { status: 500 });
    }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json(); // The data sent from the frontend arrives here
    
    const newZone = await RiskZone.create(body); // Creating a new record in the database
    return NextResponse.json(newZone, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 400 });
  }
}