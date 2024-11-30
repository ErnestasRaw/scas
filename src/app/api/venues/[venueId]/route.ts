// src/pages/api/venues/[venueId].ts
import { NextResponse } from "next/server"; 
import { connectDB } from "@/backend/lib/mongodb"; 
import Venue from "@/models/Venues"; 

export async function GET(req: Request, { params }: { params: { venueId: string } }) {
  const { venueId } = params;


  try {
    await connectDB();


    const venue = await Venue.findById(venueId);
    
    if (!venue) {
      console.log(`Venue su ID ${venueId} nera`);
      return NextResponse.json(
        { message: "Venue nera" },
        { status: 404 }
      );
    }


    return NextResponse.json(venue, { status: 200 });
  } catch (error) {
    // Log the error details
    console.error("Error fetching venue:", error);

    return NextResponse.json(
      { message: "Error fetching venue data" },
      { status: 500 }
    );
  }
}
