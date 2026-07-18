const db = require('./src/lib/db.js').default || require('./src/lib/db.js');

async function migrateUsers() {
    try {
        await db.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
        console.log("Added role column to users table.");
    } catch (err) {
        // Ignore if column already exists
        if (err.message.includes("duplicate column name")) {
             console.log("Role column already exists.");
        } else {
             console.error("Migration failed:", err);
        }
    }
}
migrateUsers();
