import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrateRoles() {
    console.log("Migrating users table to include roles...");
    try {
        // Try to add the column. It might throw if it already exists, so we catch it.
        try {
            await db.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
            console.log("Added 'role' column to users table.");
        } catch (err) {
            if (err.message.includes("duplicate column name")) {
                console.log("'role' column already exists.");
            } else {
                throw err;
            }
        }
        
        console.log("Ensuring admin user suryagam2205@gmail.com exists...");
        
        const adminEmail = "suryagam2205@gmail.com";
        const result = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [adminEmail]
        });
        
        if (result.rows.length > 0) {
            // Update to admin
            await db.execute({
                sql: "UPDATE users SET role = 'admin' WHERE email = ?",
                args: [adminEmail]
            });
            console.log("Updated existing user to admin role.");
        } else {
            // Insert new admin user with a default password (they can also login via Google)
            const hashedPassword = await bcrypt.hash("Admin@123", 10);
            await db.execute({
                sql: "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                args: ["Admin", adminEmail, hashedPassword, "admin"]
            });
            console.log(`Created new admin user with email ${adminEmail} and default password 'Admin@123'.`);
        }
        
        console.log("Roles migration complete.");
    } catch (error) {
        console.error("Failed to migrate roles:", error);
    }
}

migrateRoles();
