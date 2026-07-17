import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, password, age, bloodGroup, gender, profilePic } = body;

        // Check if user exists
        const result = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [email]
        });

        if (result.rows.length > 0) {
            return Response.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.execute({
            sql: "INSERT INTO users (name, email, password, age, blood_type, gender, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)",
            args: [name, email, hashedPassword, age || null, bloodGroup || null, gender || null, profilePic || null]
        });

        return Response.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
