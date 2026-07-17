"use client";

import { useState } from "react";
import pageStyles from "../page.module.css";
import styles from "../login/Login.module.css"; // Reuse form styles

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: "success", msg: data.message });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus({ type: "error", msg: data.error });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "An error occurred. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className={pageStyles.main} style={{ paddingTop: "8rem" }}>
      <section className={pageStyles.section}>
        <div className="container">
          <h1 className="heading" style={{ fontSize: "3.5rem", marginBottom: "4rem" }}>Contact Us</h1>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem", justifyContent: "center" }}>
            
            {/* Contact Info */}
            <div style={{ flex: "1 1 400px", background: "hsl(var(--primary))", color: "white", padding: "4rem", borderRadius: "10px" }}>
              <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Get In Touch</h2>
              <p style={{ fontSize: "1.6rem", marginBottom: "3rem", lineHeight: "1.6" }}>
                Have questions about our services or want to schedule an appointment? We're here to help you get the smile you deserve.
              </p>
              
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", fontSize: "1.6rem" }}>
                <i className="fas fa-map-marker-alt" style={{ width: "30px", fontSize: "2rem" }}></i>
                <span>123 Dental Avenue, Medical District, NY 10001</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", fontSize: "1.6rem" }}>
                <i className="fas fa-phone-alt" style={{ width: "30px", fontSize: "2rem" }}></i>
                <span>+1 (555) 123-4567</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", fontSize: "1.6rem" }}>
                <i className="fas fa-envelope" style={{ width: "30px", fontSize: "2rem" }}></i>
                <span>contact@dentalexperts.com</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", fontSize: "1.6rem" }}>
                <i className="fas fa-clock" style={{ width: "30px", fontSize: "2rem" }}></i>
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>

            {/* Contact Form */}
            <div style={{ flex: "1 1 400px" }}>
              <form onSubmit={handleSubmit} className={styles.formContainer} style={{ width: "100%", margin: "0", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                <h3 className={styles.title} style={{ marginBottom: "2rem" }}>Send a Message</h3>
                
                {status && (
                  <div className={status.type === "error" ? styles.errorMsg : styles.successMsg} style={{ marginBottom: "2rem", padding: "1rem", borderRadius: "5px", background: status.type === "error" ? "#fee2e2" : "#dcfce7", color: status.type === "error" ? "#991b1b" : "#166534", fontSize: "1.4rem" }}>
                    {status.msg}
                  </div>
                )}

                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="john@example.com" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="phone">Phone</label>
                  <input type="text" id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required placeholder="(555) 000-0000" />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required placeholder="How can we help you?" style={{ width: "100%", padding: "1.2rem", border: "1px solid #ddd", borderRadius: "8px", fontSize: "1.5rem", minHeight: "120px", resize: "vertical" }}></textarea>
                </div>
                
                <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
