import { NextResponse } from 'next/server';
import Reservations from '@/models/Reservations';

export async function GET(req, { params }) {
  const { venueId } = await params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date) {
    return new Response("Reikalinga data", { status: 400 });
  }

  try {
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const reservations = await Reservations.find({
      venueId: venueId,
      reservationDate: {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    const reservedTimes = reservations.map((reservation) => {
      const reservationHour = new Date(reservation.reservationDate).getHours();
      return `${reservationHour.toString().padStart(2, '0')}:00`;
    });

    return new Response(JSON.stringify({ reservedTimes }), { status: 200 });

  } catch (error) {
    console.error("Klaida užklausų gavime:", error);
    return new Response("Serverio klaida", { status: 500 });
  }
}
