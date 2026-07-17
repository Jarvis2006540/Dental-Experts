import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        // ONLY admin can create staff
        if (!session || session.user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized: Only admins can create staff' }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
             return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user already exists
        const existing = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [email]
        });

        if (existing.rows.length > 0) {
            return Response.json({ error: 'A user with this email already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute({
            sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            args: [name, email, hashedPassword, "staff"]
        });

        return Response.json({ message: 'Staff member created successfully' }, { status: 201 });
    } catch (error) {
        console.error("Admin Staff Creation Error:", error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const result = await db.execute("SELECT id, name, email, role, created_at FROM users WHERE role = 'staff'");

        return Response.json({ staff: result.rows }, { status: 200 });
    } catch (error) {
         console.error("Admin Staff Fetch Error:", error);
         return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
