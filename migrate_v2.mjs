import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrateV2() {
  console.log("Starting Migration V2...");

  try {
    // 1. Contacts Table
    console.log("Creating contacts table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Reports Table
    console.log("Creating reports table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        title TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        content_or_link TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Reviews Table
    console.log("Creating reviews table...");
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        user_name TEXT NOT NULL,
        doctor_name TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Update Blog Image
    console.log("Updating broken blog image...");
    await db.execute(`
      UPDATE blogs 
      SET image = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      WHERE title LIKE '%Flossing Daily%'
    `);

    console.log("Migration V2 completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateV2();
