import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/services/auth.store';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Login failed.', error: (error as Error).message },
      { status: 400 }
    );
  }
}
