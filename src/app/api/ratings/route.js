import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await db.execute("SELECT * FROM ratings ORDER BY created_at DESC");
        return NextResponse.json({ ratings: result.rows }, { status: 200 });
    } catch (error) {
        console.error("Fetch Ratings Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
