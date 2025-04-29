/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/quotation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { Quotation } from '../../../../Models/quotation.model';
import { verifyToken } from '../../../../lib/auth';

export async function POST(req: NextRequest) {
  await connectDB();
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded: any = verifyToken(token);
    const body = await req.json();

    const newQuote = await Quotation.create({
      userId: decoded.userId,
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({ quotation: newQuote });
  } catch (err) {
    return NextResponse.json({ message: 'Error creating quotation' }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
    await connectDB();
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
    try {
      const decoded: any = verifyToken(token);
      const quotations = await Quotation.find({ userId: decoded.userId }).sort({ createdAt: -1 });
  
      return NextResponse.json({ quotations });
    } catch {
      return NextResponse.json({ message: 'Error fetching quotations' }, { status: 500 });
    }
  }
  