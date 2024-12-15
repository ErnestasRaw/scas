
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Reservation from '@/models/Reservations';

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = await params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }


    const reservations = await Reservation.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate('venueId', 'name location') 
      .sort({ reservationDate: -1 }); 

    if (!reservations.length) {
      return NextResponse.json({ message: 'No reservations found' }, { status: 404 });
    }

    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching reservations' }, { status: 500 });
  }
}
