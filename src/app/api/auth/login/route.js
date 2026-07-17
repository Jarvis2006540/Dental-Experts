import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password, isAdmin } = body;

        if (isAdmin) {
            const result = await db.execute({
                sql: "SELECT * FROM admins WHERE username = ?",
                args: [email]
            });
            if (result.rows.length === 0) return Response.json({ error: 'Invalid admin credentials' }, { status: 400 });
            
            const admin = result.rows[0];
            const isValid = await bcrypt.compare(password, admin.password);
            
            const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
            return Response.json({ token, user: { username: admin.username, role: 'admin' } });
        } else {
            const result = await db.execute({
                sql: "SELECT * FROM users WHERE email = ?",
                args: [email]
            });
            if (result.rows.length === 0) return Response.json({ error: 'Invalid credentials' }, { status: 400 });
            
            const user = result.rows[0];
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) return Response.json({ error: 'Invalid credentials' }, { status: 400 });
            
            const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
            
            // Record login history
            await db.execute({
                sql: "INSERT INTO login_history (email, password) VALUES (?, ?)",
                args: [email, "hashed_pwd_placeholder"]
            });

            return Response.json({ token, user: { name: user.name, email: user.email, role: 'user', profilePic: user.profile_pic } });
        }
    } catch (error) {
        console.error("Login Error:", error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
