"use client";

import pageStyles from "../page.module.css";
import { useEffect, useState } from "react";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/ratings");
        if (res.ok) {
          const data = await res.json();
          setReviews(data.ratings || []);
        }
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const hiddenElements = document.querySelectorAll(`.${pageStyles.hidden}`);
        hiddenElements.forEach(el => el.classList.add(pageStyles.show));
      }, 100);
    }
  }, [loading]);

  return (
    <div className={pageStyles.main} style={{ paddingTop: "8rem" }}>
      <section className={`${pageStyles.section} ${pageStyles.bgMuted}`}>
        <div className="container">
          <h1 className="heading" style={{ fontSize: "3.5rem", marginBottom: "4rem" }}>Patient Reviews</h1>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {loading ? (
              <p style={{ textAlign: "center", fontSize: "1.6rem", gridColumn: "1 / -1" }}>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p style={{ textAlign: "center", fontSize: "1.6rem", gridColumn: "1 / -1" }}>No reviews yet.</p>
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
