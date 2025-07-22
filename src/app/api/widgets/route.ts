import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';

export async function GET() {
  await dbConnect();
  try {
    const widgets = await Widget.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: widgets });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Start with an empty reviews array
    const widgetData = { ...body, reviews: [] };
    const widget = await Widget.create(widgetData);
    
    return NextResponse.json({ success: true, data: widget }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // This will handle both standard errors and Zod validation errors
    const message = (error instanceof Error && error.message) ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
