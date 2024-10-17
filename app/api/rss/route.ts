import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');
    if (!bookingId) {
        return NextResponse.json({ error: "bookingId parameter not provided." }, { status: 400 });
    }
    try {

        return new NextResponse('Hello');

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Error generating the RSS feed. Check that the Youtube url is a channel or a playlist" }, { status: 500 });
    }
}

