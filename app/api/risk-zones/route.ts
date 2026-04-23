import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import RiskZone from "@/models/RiskZone";

export async function GET() {
    try {
        await connectDB();
        const riskZones = await RiskZone.find({});
        return NextResponse.json(riskZones,{ status: 200 });

    }catch {
        return NextResponse.json({ error: "Failed to fetch risk zones" },
             { status: 500 });
    }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json(); // Frontend එකෙන් එවපු data ටික මෙතනට එනවා
    
    const newZone = await RiskZone.create(body); // Database එකේ අලුත් record එකක් හදනවා
    return NextResponse.json(newZone, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 400 });
  }
}