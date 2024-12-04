import { NextResponse } from "next/server"; 
import { connectDB } from "@/backend/lib/mongodb"; 
import Reservations from "@/models/Reservations"; 
import User from "@/models/User";


export async function POST(req: Request) {
  const body = await req.json();

  if (!body) {
    return NextResponse.json(
      { message: "Nenurodyti rezervacijos duomenys" },
      { status: 400 }
    );
  }

  const { venueId, date, time, status, userId } = body;

  const formatDateTime = (date: string, time: string) => {
    const parsedDate = new Date(date); 
    const [hours, minutes] = time.split(":").map(Number);

    const combinedDateTime = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      hours,
      minutes
    );
    
    return combinedDateTime;
  };

  const reservation = new Reservations({
    venueId,
    reservationDate: formatDateTime(date, time),
    status,
    userId,
  });

  try {
    await reservation.save();

   
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "Vartotojas nerastas" },
        { status: 404 }
      );
    }

    user.orderHistory.push(reservation._id); 
    await user.save(); 

    return NextResponse.json(reservation, { status: 200 });
  } catch (error) {
    console.error("Klaida kuriant rezervaciją", error);
    return NextResponse.json(
      { message: "Klaida kuriant rezervaciją" },
      { status: 500 }
    );
  }
}
