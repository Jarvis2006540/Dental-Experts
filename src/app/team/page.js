"use client";

import pageStyles from "../page.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Team() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        if (res.ok) {
          const data = await res.json();
          setDoctors(data.doctors || []);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Need a small timeout to let the DOM update before finding hidden elements
      setTimeout(() => {
        const hiddenElements = document.querySelectorAll(`.${pageStyles.hidden}`);
        hiddenElements.forEach(el => el.classList.add(pageStyles.show));
      }, 100);
    }
  }, [loading]);

  return (
    <div className={pageStyles.main} style={{ paddingTop: "8rem" }}>
      <section className={pageStyles.section}>
        <div className="container">
          <h1 className="heading" style={{ fontSize: "3.5rem", marginBottom: "4rem" }}>Meet Our Expert Team</h1>
          
          {loading ? (
             <div style={{ textAlign: "center", padding: "4rem 0" }}>Loading our team...</div>
          ) : (
            <div className={pageStyles.teamGrid}>
              {doctors.map((doc, idx) => (
                <div key={idx} className={`${pageStyles.teamCard} ${pageStyles.hidden}`}>
                  <div className={pageStyles.teamImgWrapper}>
                    {doc.image ? (
                        <img src={doc.image} alt={doc.name} />
                    ) : (
                        <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--muted)'}}>
                            <i className="fas fa-user-md" style={{ fontSize: "5rem", color: "hsl(var(--primary))" }}></i>
                        </div>
                    )}
                    <div className={pageStyles.teamSocials}>
                      <a href="#"><i className="fab fa-facebook-f"></i></a>
                      <a href="#"><i className="fab fa-twitter"></i></a>
                      <a href="#"><i className="fab fa-instagram"></i></a>
                    </div>
                  </div>
                  <div className={pageStyles.teamInfo}>
                    <h3>{doc.name}</h3>
                    <p>{doc.specialization}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "5rem" }}>
            <p style={{ fontSize: "1.6rem", color: "hsl(var(--text-muted))", marginBottom: "2rem" }}>
              Our professionals are here to provide the best care. 
            </p>
             <Link href="/book-appointment" className="btn-primary">Schedule an Appointment</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
