
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import { z } from 'zod';

interface Params {
  id: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      return NextResponse.json({ success: false, error: 'Widget not found' }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json({ success: true, data: widget }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400, headers: corsHeaders });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  await dbConnect();
  try {
    const deletedWidget = await Widget.findByIdAndDelete(params.id);
    if (!deletedWidget) {
      return NextResponse.json({ success: false, error: 'Widget not found' }, { status: 404, headers: corsHeaders });
    }
    return NextResponse.json({ success: true, data: {} }, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400, headers: corsHeaders });
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
