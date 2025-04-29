import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_: NextRequest) {
  // If using cookies/session: clear cookie or session store here
  return NextResponse.json({ message: 'Logged out' });
}
