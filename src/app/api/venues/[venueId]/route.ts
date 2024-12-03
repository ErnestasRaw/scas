import { NextResponse } from "next/server"; 
import { connectDB } from "@/backend/lib/mongodb"; 
import VenueDocument from "@/models/Venues"; 

export async function GET(req: Request, { params }: { params: { venueId: string } }) {
  const { venueId } = await params;


  try {
    await connectDB();


    const venue = await VenueDocument.findById(venueId);
    
    if (!venue) {
      console.log(`Sale su ID ${venueId} nera`);
      return NextResponse.json(
        { message: "Sales nera" },
        { status: 404 }
      );
    }


    return NextResponse.json(venue, { status: 200 });
  } catch (error) {
    console.error("Klaida randant sale:", error);

    return NextResponse.json(
      { message: "Klaida gaunant sales duomenis" },
      { status: 500 }
    );
  }
}
