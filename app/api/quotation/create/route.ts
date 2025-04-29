// app/api/quotation/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import quotationModel from '../../../../Models/quotation.model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { formData, summary } = body;

    if (!formData || !summary) {
      return NextResponse.json({ message: 'Missing formData or summary' }, { status: 400 });
    }

    const quotation = await quotationModel.create({ formData, summary });

    return NextResponse.json({ message: 'Quotation saved', quotation }, { status: 201 });
  } catch (err) {
    console.error('Error saving quotation:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
