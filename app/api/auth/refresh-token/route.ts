import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, createToken } from '../../../../lib/auth' ;

export async function POST(req: NextRequest) {
  const { refreshToken } = await req.json();

  try {
    const userId = verifyRefreshToken(refreshToken);
    const newAccessToken = createToken(userId);

    return NextResponse.json({ token: newAccessToken });
  } catch {
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 });
  }
}
