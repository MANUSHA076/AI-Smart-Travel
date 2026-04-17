import { connectDB } from "@/lib/db";
import TravelAlert from "@/models/TravelAlert";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    await TravelAlert.create({
      type: "Flood",
      location: "Galle",
      riskLevel: "High",
      message: "Heavy rains expected, stay indoors and avoid low-lying areas.",
    });
    return NextResponse.json({ message: "Travel alert created successfully" });
} catch (error) {
  return NextResponse.json({ message: "Error creating travel alert", error }, { status: 500 });
}
}