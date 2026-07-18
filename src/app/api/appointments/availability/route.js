import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const doctor = searchParams.get('doctor');
        const date = searchParams.get('date');

        if (!doctor || !date) {
            return NextResponse.json({ error: 'Missing doctor or date parameter' }, { status: 400 });
        }

        // We search for appointments that match the doctor and the date portion of the appointment_date
        // Since appointment_date is stored as "YYYY-MM-DD HH:MM AM/PM", we can use LIKE
        const result = await db.execute({
            sql: "SELECT appointment_date FROM appointments WHERE doctor = ? AND appointment_date LIKE ? AND status = 'Scheduled'",
            args: [doctor, `${date}%`]
        });

        const bookedSlots = result.rows.map(row => {
            // Extract just the time part, e.g. "10:00 AM" from "2024-05-20 10:00 AM"
            const timePart = row.appointment_date.split(' ').slice(1).join(' ');
            return timePart;
        });

        return NextResponse.json({ bookedSlots }, { status: 200 });
    } catch (error) {
        console.error("Availability Fetch Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
