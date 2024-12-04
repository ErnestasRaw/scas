import { NextRequest, NextResponse } from 'next/server';
import Venue from '@/models/Venues';

export async function GET() {
  try {
    const venues = await Venue.find();
    return NextResponse.json(venues, { status: 200 });
  } catch (error) {
    console.error("Klaida įkeliant sales:", error);
    return NextResponse.json({ error: 'Klaida įkeliant sales' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newVenue = new Venue(body);
    await newVenue.save();

    return NextResponse.json(newVenue, { status: 201 });
  } catch (error) {
    console.error("Klaida kuriant sale:", error);
    return NextResponse.json({ error: 'Klaida kuriant sale' }, { status: 400 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const venueId = req.nextUrl.searchParams.get('id');
    if (!venueId) {
      return NextResponse.json({ error: 'Nenurodytas ID' }, { status: 400 });
    }

    const body = await req.json();
    const updatedVenue = await Venue.findByIdAndUpdate(venueId, body, { new: true });

    if (!updatedVenue) {
      return NextResponse.json({ error: 'Sale nerasta' }, { status: 404 });
    }

    return NextResponse.json(updatedVenue, { status: 200 });
  } catch (error) {
    console.error("laida atnaujinant sale:", error);
    return NextResponse.json({ error: 'Klaida atnaujinant sale' }, { status: 400 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const venueId = req.nextUrl.searchParams.get('id');
    if (!venueId) {
      return NextResponse.json({ error: 'Nenurodytas ID' }, { status: 400 });
    }

    const deletedVenue = await Venue.findByIdAndDelete(venueId);
    if (!deletedVenue) {
      return NextResponse.json({ error: 'Sale nerasta' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Klaida šalinant sale:", error);
    return NextResponse.json({ error: 'Klaida šalinant sale' }, { status: 400 });
  }
}


