import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import bcrypt from 'bcryptjs'; 

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  const { currentPassword, newPassword, confirmPassword } = await req.json(); 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Vartotojas nerastas' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Neteisingas esamas slaptažodis' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Naujas slaptažodis ir patvirtinimas nesutampa' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12); 

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Slaptažodis sėkmingai pakeistas' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Vidinė serverio klaida' }, { status: 500 });
  }
}