/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { User } from '../../../../Models/user.model';
import { createToken, verifyRefreshToken, verifyToken } from '../../../../lib/auth';
export async function GET(req: NextRequest) {
  await connectDB();

  const authHeader = req.headers.get('authorization');
  const refreshHeader = req.headers.get('x-refresh-token');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("No token provided");
    return NextResponse.json({ message: 'No token provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  const refreshToken = refreshHeader || '';

  try {
    const decoded = verifyToken(token) as { userId: string };

    const user = await User.findById(decoded.userId).select('name email');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    console.error("Token error:", err);

    // If the token is expired, try refreshing it
    if (err.name === 'TokenExpiredError') {
      console.log('Access token expired, trying to refresh...');

      if (!refreshToken) {
        return NextResponse.json({ message: 'No refresh token provided' }, { status: 401 });
      }

      try {
        const decodedRefresh = verifyRefreshToken(refreshToken) as { userId: string };

        // Refresh token is valid -> create a new access token
        const newAccessToken = createToken(decodedRefresh.userId);

        return NextResponse.json(
          { message: 'Token refreshed', accessToken: newAccessToken },
          { status: 200 }
        );
      } catch (refreshErr) {
        console.error("Refresh token error:", refreshErr);
        return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
      }
    }

    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

