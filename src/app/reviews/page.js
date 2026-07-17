"use client";

import pageStyles from "../page.module.css";
import { useEffect, useState } from "react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from /api/ratings
    // Using static dummy data for demonstration
    const dummyReviews = [
      { id: 1, user_name: "John Smith", doctor_name: "Dr. Sarah Cooper", rating: 5, review_text: "Excellent service! Highly recommend Dr. Cooper for anyone needing alignment." },
      { id: 2, user_name: "Alice Johnson", doctor_name: "Dr. Emily Rodriguez", rating: 5, review_text: "Very professional and painless cosmetic procedure." },
      { id: 3, user_name: "Michael Brown", doctor_name: "Dr. John Doe", rating: 4, review_text: "Great experience overall, the root canal was handled perfectly." },
      { id: 4, user_name: "Emma Davis", doctor_name: "Dr. David Parker", rating: 5, review_text: "Thorough cleaning and great advice on oral hygiene." }
    ];
    setReviews(dummyReviews);
    setLoading(false);

    const hiddenElements = document.querySelectorAll(`.${pageStyles.hidden}`);
    hiddenElements.forEach(el => el.classList.add(pageStyles.show));
  }, []);

  return (
    <div className={pageStyles.main} style={{ paddingTop: "8rem" }}>
      <section className={`${pageStyles.section} ${pageStyles.bgMuted}`}>
        <div className="container">
          <h1 className="heading" style={{ fontSize: "3.5rem", marginBottom: "4rem" }}>Patient Reviews</h1>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {loading ? (
              <p style={{ textAlign: "center", fontSize: "1.6rem" }}>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "1.6rem" }}>No reviews yet.</p>
            ) : (
              reviews.map(review => (
                <div key={review.id} className={`${pageStyles.hidden}`} style={{ background: "white", padding: "2rem", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontSize: "1.8rem", color: "hsl(var(--primary-dark))" }}>{review.user_name}</h3>
                    <div style={{ color: "#fbbf24" }}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={i < review.rating ? "fas fa-star" : "far fa-star"}></i>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: "1.4rem", color: "hsl(var(--text-muted))", marginBottom: "1rem" }}>
                    <strong>Attended by:</strong> {review.doctor_name}
                  </p>
                  <p style={{ fontSize: "1.5rem", lineHeight: "1.6", fontStyle: "italic" }}>"{review.review_text}"</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
