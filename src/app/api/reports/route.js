import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // We need the user's DB ID to fetch reports
        const userRes = await db.execute({
            sql: "SELECT id FROM users WHERE email = ?",
            args: [session.user.email]
        });

        if (userRes.rows.length === 0) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const userId = userRes.rows[0].id;

        const result = await db.execute({
            sql: "SELECT * FROM reports WHERE user_id = ? ORDER BY report_date DESC",
            args: [userId]
        });

        return Response.json({ reports: result.rows }, { status: 200 });
    } catch (error) {
         console.error("Fetch Reports Error:", error);
         return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
