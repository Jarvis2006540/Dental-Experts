import { createClient } from "@libsql/client";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrateBlogs() {
    console.log("Creating blogs table...");
    try {
        await db.execute(`
            CREATE TABLE IF NOT EXISTS blogs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                content TEXT NOT NULL,
                image TEXT NOT NULL,
                author TEXT NOT NULL,
                published_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Blogs table created.");
        
        console.log("Seeding dummy blogs...");
        const blogs = [
            {
                title: "The Importance of Flossing Daily",
                summary: "Learn why flossing is just as crucial as brushing for your long-term oral health.",
                content: "Flossing does about 40% of the work required to remove sticky bacteria, or plaque, from your teeth. Plaque generates acid, which can cause cavities, irritate the gums, and lead to gum disease...",
                image: "https://images.unsplash.com/photo-1598256989800-fea5f67ddc7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                author: "Dr. Sarah Cooper"
            },
            {
                title: "Top 5 Teeth Whitening Myths Debunked",
                summary: "Are strawberries and baking soda really effective? We dive into the truth behind teeth whitening.",
                content: "When it comes to whitening your teeth, there is a lot of misinformation out there. Some natural remedies can actually erode your enamel rather than whiten your teeth...",
                image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                author: "Dr. Emily Rodriguez"
            }
        ];

        for (const blog of blogs) {
            await db.execute({
                sql: "INSERT INTO blogs (title, summary, content, image, author) VALUES (?, ?, ?, ?, ?)",
                args: [blog.title, blog.summary, blog.content, blog.image, blog.author]
            });
        }
        
        console.log("Dummy blogs seeded successfully.");
    } catch (error) {
        console.error("Failed to migrate or seed blogs:", error);
    }
}

migrateBlogs();
