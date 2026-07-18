import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await db.execute("SELECT * FROM doctors ORDER BY name ASC");
        return NextResponse.json({ doctors: result.rows }, { status: 200 });
    } catch (error) {
        console.error("Fetch Doctors Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
