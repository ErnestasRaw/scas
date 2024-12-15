import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'; 

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;

  try {

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Vidinė serverio klaida' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  const { name, email, phone } = await req.json();  

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Vidinė serverio klaida' }, { status: 500 });
  }
}
