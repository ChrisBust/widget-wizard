
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';

interface Params {
  id: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(request: Request, { params }: { params: Params }) {
  await dbConnect();
  try {
    const widget = await Widget.findById(params.id);
    if (!widget) {
      return NextResponse.json({ success: false, error: 'Widget not found' }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json({ success: true, data: widget }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400, headers: corsHeaders });
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  await dbConnect();
  try {
    const widget = await Widget.findByIdAndUpdate(params.id, await request.json(), {
      new: true,
      runValidators: true,
    });
    if (!widget) {
      return NextResponse.json({ success: false, error: 'Widget not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: widget });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  await dbConnect();
  try {
    const deletedWidget = await Widget.findByIdAndDelete(params.id);
    if (!deletedWidget) {
      return NextResponse.json({ success: false, error: 'Widget not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
