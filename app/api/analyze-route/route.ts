import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { startLocation, destination, travelMode } = await req.json();

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
"tips": (array),
"routeCoordinates": (An array of coordinates following the format [longitude, latitude]. 
IMPORTANT: Sri Lanka's longitude is around 79-81 and latitude is 5-9. 
Provide at least 15-20 intermediate points along the actual main roads to make the path look realistic and curved, not a straight line.)`
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const aiResponse = JSON.parse(completion.choices[0]?.message?.content || "{}");

    console.log("AI Response with Coordinates:", aiResponse.routeCoordinates);

    return NextResponse.json(aiResponse);

  } catch (error: unknown) {   const errorMessage = error instanceof Error ? error.message : "Unknown error";  return NextResponse.json({ error: "Analysis Failed", details: errorMessage }, { status: 500 });  }}
