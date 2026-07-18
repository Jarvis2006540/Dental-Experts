const db = require('./src/lib/db.js').default || require('./src/lib/db.js');

async function seedRatings() {
    try {
        const dummyReviews = [
            { user_name: "John Smith", user_email: "john@example.com", doctor_name: "Dr. Sarah Cooper", rating: 5, review_text: "Excellent service! Highly recommend Dr. Cooper for anyone needing alignment." },
            { user_name: "Alice Johnson", user_email: "alice@example.com", doctor_name: "Dr. Emily Rodriguez", rating: 5, review_text: "Very professional and painless cosmetic procedure." },
            { user_name: "Michael Brown", user_email: "michael@example.com", doctor_name: "Dr. John Doe", rating: 4, review_text: "Great experience overall, the root canal was handled perfectly." },
            { user_name: "Emma Davis", user_email: "emma@example.com", doctor_name: "Dr. David Parker", rating: 5, review_text: "Thorough cleaning and great advice on oral hygiene." }
        ];

        for (const rev of dummyReviews) {
            await db.execute({
                sql: "INSERT INTO ratings (doctor_name, user_email, user_name, rating, review_text) VALUES (?, ?, ?, ?, ?)",
                args: [rev.doctor_name, rev.user_email, rev.user_name, rev.rating, rev.review_text]
            });
        }
        console.log("Ratings seeded successfully.");
    } catch (err) {
        console.error("Failed to seed ratings:", err);
    }
}
seedRatings();
