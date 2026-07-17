import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/services/auth.store';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const isRegistered = registerUser({ name, email, password });
    if (!isRegistered) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered.' },
        { status: 409 }
      );
    }

    return NextResponse.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Registration failed', error: (error as Error).message },
      { status: 400 }
    );
  }
}
