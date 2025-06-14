/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import Colorcode from '../../../../Models/colorcode.model';

// GET all entries
export async function GET() {
  try {
    await connectDB();
    const data = await Colorcode.find().exec();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch color codes' }, { status: 500 });
  }
}

// POST new entry
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('Received body:', body);

    // Validate required fields
    if (!body.colorName?.trim() || !body.colorCode?.trim()) {
      return NextResponse.json(
        { error: 'Both colorName and colorCode are required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate color code format
    

    // Check if color already exists
    const existingColor = await Colorcode.findOne({ 
      $or: [
        { colorName: body.colorName },
        { colorCode: body.colorCode }
      ]
    }).exec();

    if (existingColor) {
      return NextResponse.json(
        { error: 'Color with this name or code already exists' },
        { status: 409 }
      );
    }

    const created = await Colorcode.create({
      colorName: body.colorName.trim(),
      colorCode: body.colorCode.trim()
    });
    
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('Error in POST handler:', err);
    return NextResponse.json(
      { 
        error: err instanceof Error ? err.message : 'Failed to create color',
        details: err instanceof Error ? err : null
      }, 
      { status: 400 }
    );
  }
}

// PUT to update by ID
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...rest } = await req.json();
    console.log('Received PUT body:', { id, ...rest });
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Validate required fields
    if (!rest.colorName || !rest.colorCode) {
      return NextResponse.json(
        { error: 'Both colorName and colorCode are required' },
        { status: 400 }
      );
    }

    const updated = await Colorcode.findByIdAndUpdate(id, rest, { 
      new: true,
      runValidators: true 
    }).exec();
    
    if (!updated) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update color' }, 
      { status: 400 }
    );
  }
}

// DELETE by ID
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const deleted = await Colorcode.findByIdAndDelete(id).exec();
    
    if (!deleted) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete color' }, 
      { status: 500 }
    );
  }
}