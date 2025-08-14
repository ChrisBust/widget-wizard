
'use server';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Widget from '@/models/widget';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const AddReviewSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  stars: z.coerce.number().min(1, 'Please select a star rating.').max(5),
  text: z.string().min(10, { message: 'Review must be at least 10 characters.' }),
  source: z.string().optional(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const widgetId = params.id;

    try {
        const body = await request.json();
        const validatedFields = AddReviewSchema.safeParse(body);

        if (!validatedFields.success) {
            return NextResponse.json({ 
                success: false, 
                error: 'Validation failed', 
                details: validatedFields.error.flatten().fieldErrors 
            }, { status: 400, headers: corsHeaders });
        }

        const { name, stars, text, source } = validatedFields.data;

        const widget = await Widget.findById(widgetId);

        if (!widget) {
            return NextResponse.json({ success: false, error: 'Widget not found' }, { status: 404, headers: corsHeaders });
        }

        widget.reviews.push({
            name,
            stars,
            text,
            source: source || 'Direct',
        });

        await widget.save();
        
        revalidatePath('/dashboard');
        revalidatePath(`/dashboard/test`);
        revalidatePath(`/widget/${widgetId}`, 'page');

        return NextResponse.json({ success: true, message: 'Review added successfully' }, { status: 201, headers: corsHeaders });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500, headers: corsHeaders });
    }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
