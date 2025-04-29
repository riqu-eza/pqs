/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import { Packaging } from '../../../../Models/packaging.model';

// Connect DB once at top-level
await connectDB();

// GET all entries
export async function GET() {
  try {
    const data = await Packaging.find();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST new entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await Packaging.create(body);
    return NextResponse.json(created);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 400 });
  }
}

// PUT to update by ID
export async function PUT(req: NextRequest) {
  try {
    const { _id, ...rest } = await req.json();
    const updated = await Packaging.findByIdAndUpdate(_id, rest, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}

// DELETE by ID
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
  }

  try {
    await Packaging.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
