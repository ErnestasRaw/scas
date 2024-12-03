import { NextResponse } from "next/server";
import { connectDB } from "@/backend/lib/mongodb";
import Venue from "@/models/Venues"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, capacity } = body;

    if (!name || !capacity) {
      return NextResponse.json(
        { message: "Trūksta laukų" },
        { status: 400 }
      );
    }

    await connectDB();

    const newVenue = await Venue.create({ name, capacity });

    return NextResponse.json(newVenue, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { status: 500 }
    );
  }
}

export async function GET() {
    try {
      await connectDB();
      const venues = await Venue.find({});
      return NextResponse.json(venues, { status: 200 });
    } catch (error) {
      console.error("Klaida gaunant sales:", error);
      return NextResponse.json(
        { message: "Klaida gaunant sales" },
        { status: 500 }
      );
    }
  }
