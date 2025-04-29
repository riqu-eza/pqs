import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { User } from '../../../../Models/user.model';
import { compare } from 'bcryptjs';
import { createToken } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const isMatch = await compare(password, user.password);
  if (!isMatch) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const token = createToken(user._id);

  return NextResponse.json({ token, user: { email: user.email, name: user.name } });
}
