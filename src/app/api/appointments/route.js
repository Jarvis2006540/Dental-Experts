import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { doctor, appointment_date, phone } = body;

        if (!doctor || !appointment_date || !phone) {
             return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await db.execute({
            sql: "INSERT INTO appointments (name, email, phone, doctor, appointment_date, status) VALUES (?, ?, ?, ?, ?, ?)",
            args: [session.user.name, session.user.email, phone, doctor, appointment_date, 'Scheduled']
        });

        return Response.json({ message: 'Appointment booked successfully' }, { status: 201 });
    } catch (error) {
        console.error("Booking Error:", error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await db.execute({
            sql: "SELECT * FROM appointments WHERE email = ? ORDER BY appointment_date DESC",
            args: [session.user.email]
        });

        return Response.json({ appointments: result.rows }, { status: 200 });
    } catch (error) {
         console.error("Fetch Error:", error);
         return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
