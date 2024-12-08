import { NextRequest } from 'next/server';
import Reservations from '@/models/Reservations';
import User from '@/models/User';

export async function DELETE(req: NextRequest, { params }: { params: { reservationId: string } }) {
    const { reservationId } = await params;

    try {
        const reservation = await Reservations.findById(reservationId);

        if (!reservation) {
            return new Response("Rezervacija nerasta", { status: 404 });
        }

        const user = await User.findById(reservation.userId);

        await Reservations.findByIdAndDelete(reservationId);

        await User.findByIdAndUpdate(user._id, {
            $pull: { 
                reservations: reservationId,     
                orderHistory: reservationId      
            }
        });

        return new Response("Rezervacija ištrinta", { status: 200 });
    } catch (error) {
        console.error("Klaida atšaukiant rezervacija", error);
        return new Response("Server error", { status: 500 });
    }
}
