import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function seed() {
    console.log("Seeding database...");
    try {
        // Clear existing just in case
        await db.execute("DELETE FROM doctors");
        
        const doctors = [
            { name: "Dr. Sarah Cooper", specialization: "Alignment Specialist", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
            { name: "Dr. John Doe", specialization: "Root Canal Specialist", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
            { name: "Dr. Emily Rodriguez", specialization: "Cosmetic Dentistry", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
            { name: "Dr. David Parker", specialization: "Oral Hygiene Expert", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
        ];

        for (const doc of doctors) {
            await db.execute({
                sql: "INSERT INTO doctors (name, specialization, image) VALUES (?, ?, ?)",
                args: [doc.name, doc.specialization, doc.image]
            });
        }
        
        console.log("Doctors seeded.");

    } catch (error) {
        console.error("Failed to seed:", error);
    }
}

seed();
