/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import ArtworkColor from '../../../../Models/artwork.model';

// GET all entries
export async function GET() {
  try {
    await connectDB();
    const data = await ArtworkColor.find().exec();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// POST new entry
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('Received body to save:', body);

    const created = await ArtworkColor.create(body);
    console.log('Created document:', created);

    return NextResponse.json(created);
  } catch (err) {
    console.error('CREATE ERROR:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create' }, 
      { status: 400 }
    );
  }
}

// PUT to update by ID
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { _id, ...rest } = await req.json();
    const updated = await ArtworkColor.findByIdAndUpdate(_id, rest, { 
      new: true 
    }).exec();
    
    if (!updated) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update' }, 
      { status: 400 }
    );
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
    await connectDB();
    const deleted = await ArtworkColor.findByIdAndDelete(id).exec();
    
    if (!deleted) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete' }, 
      { status: 500 }
    );
  }
}