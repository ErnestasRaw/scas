import { NextRequest } from 'next/server';
import Reservations from '@/models/Reservations';
import { Types } from 'mongoose';

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = await params;

    try {
        const reservations = await Reservations.find({ userId: new Types.ObjectId(userId) })
            .populate("venueId", "name location")  
            .exec();

        if (!reservations || reservations.length === 0) {
            return new Response(JSON.stringify({ reservationDetails: [] }), { status: 200 });
        }

        const reservationDetails = reservations.map((reservation) => ({
            reservationId: reservation._id,
            venueName: reservation.venueId.name,
            venueType: reservation.venueId.type,
            venueLocation: reservation.venueId.location,
            reservationDate: new Date(reservation.reservationDate).toLocaleString(),
            guests: reservation.guests,
            status: reservation.status,
        }));

        return new Response(JSON.stringify({ reservationDetails }), { status: 200 });
    } catch (error) {
        console.error("Klaida gaunant rezervacijas", error);
        return new Response("Server error", { status: 500 });
    }
}
