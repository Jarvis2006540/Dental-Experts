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

        // Prevent double booking
        const existing = await db.execute({
            sql: "SELECT id FROM appointments WHERE doctor = ? AND appointment_date = ? AND status = 'Scheduled'",
            args: [doctor, appointment_date]
        });

        if (existing.rows.length > 0) {
            return Response.json({ error: 'This time slot is already booked for this doctor.' }, { status: 409 });
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

export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
             return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // We should ensure the user owns the appointment or is an admin, 
        // but for now we'll just check if the email matches.
        const existing = await db.execute({
            sql: "SELECT * FROM appointments WHERE id = ? AND email = ?",
            args: [id, session.user.email]
        });

        if (existing.rows.length === 0) {
            return Response.json({ error: 'Appointment not found or unauthorized' }, { status: 404 });
        }

        await db.execute({
            sql: "UPDATE appointments SET status = ? WHERE id = ?",
            args: [status, id]
        });

        return Response.json({ message: 'Appointment updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Update Error:", error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
