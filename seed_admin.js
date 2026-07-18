const db = require('./src/lib/db.js').default || require('./src/lib/db.js');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        // Check if admin exists
        const result = await db.execute("SELECT * FROM users WHERE email = 'admin@dentalexperts.com'");
        if (result.rows.length === 0) {
            await db.execute({
                sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                args: ["Super Admin", "admin@dentalexperts.com", hashedPassword, "admin"]
            });
            console.log("Admin user created (admin@dentalexperts.com / admin123)");
        } else {
            console.log("Admin user already exists.");
        }
    } catch (err) {
        console.error("Failed to seed admin:", err);
    }
}
seedAdmin();
