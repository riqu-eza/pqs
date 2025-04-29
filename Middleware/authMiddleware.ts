/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { verifyToken } from '../lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export function authMiddleware(handler: Function) {
  return async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.split(' ')[1];

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
      const payload = verifyToken(token);
      return handler(req, payload); // Pass user info to handler
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 403 });
    }
  };
}
