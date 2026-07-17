import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

// Simple middleware to check if user is admin. 
// In a real app, this should check a role flag in the user DB.
// For demonstration, we'll assume any logged in user can access admin OR check a specific admin email.
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // We can fetch all appointments
        const result = await db.execute("SELECT * FROM appointments ORDER BY appointment_date DESC");

        return Response.json({ appointments: result.rows }, { status: 200 });
    } catch (error) {
         console.error("Admin Appointments Error:", error);
         return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
             return Response.json({ error: 'Missing id or status' }, { status: 400 });
        }

        await db.execute({
            sql: "UPDATE appointments SET status = ? WHERE id = ?",
            args: [status, id]
        });

        return Response.json({ message: 'Appointment updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("Admin Appointment Update Error:", error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
