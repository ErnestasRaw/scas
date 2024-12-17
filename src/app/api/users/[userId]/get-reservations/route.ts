import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import Reservations from "@/models/Reservations"; 
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
  
    const reservations = await Reservations.find({ userId: new ObjectId(userId) }).populate('venueId');
  
    if (!reservations.length) {
      return NextResponse.json({ message: 'Nerasta jokių rezervacijų', reservations: [] }, { status: 200 });
    }
  
    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Įvyko klaida' }, { status: 500 });
  }
}
