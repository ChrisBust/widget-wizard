
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

// This file is now deprecated and can be removed, but we'll keep it for now 
// to avoid breaking old embeds. It will return a 404.
export async function GET() {
    notFound();
}
