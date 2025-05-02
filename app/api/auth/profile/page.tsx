import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/user.model';
import { createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password } = await req.json();

  const userExists = await User.findOne({ email });
  if (userExists) return NextResponse.json({ message: 'User already exists' }, { status: 400 });

  const hashedPassword = await hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = createToken(user._id);

  return NextResponse.json({ token, user: { email: user.email, name: user.name } });
}
