import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectDB } from '@/backend/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select('name email phone createdAt orderHistory role');
    return NextResponse.json(users);
  } catch (err) {
    console.error(err);
    console.log(err)
    return NextResponse.json({ error: 'Nepavyko įkelti vartotojų' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('id');
    if (!userId) {
      return NextResponse.json({ error: 'Nenurodytas ID' }, { status: 400 });
    }

    const deletedVenue = await User.findByIdAndDelete(userId);
    if (!deletedVenue) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Klaida šalinant vartotoją:", error);
    return NextResponse.json({ error: 'Klaida šalinant vartotoją' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('id');
    if (!userId) {
      return NextResponse.json({ error: 'Nenurodytas ID' }, { status: 400 });
    }

    const body = await req.json();
    const updatedUser = await User.findByIdAndUpdate(userId, body, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Klaida atnaujinant Vartotoją :", error);
    return NextResponse.json({ error: 'Klaida atnaujinant Vartotoją' }, { status: 400 });
  }
}