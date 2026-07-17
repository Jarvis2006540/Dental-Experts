"use client";

import pageStyles from "../page.module.css";
import { useEffect } from "react";
import Link from "next/link";

export default function Team() {
  useEffect(() => {
    const hiddenElements = document.querySelectorAll(`.${pageStyles.hidden}`);
    hiddenElements.forEach(el => el.classList.add(pageStyles.show));
  }, []);

  const doctors = [
    { name: "Dr. Sarah Cooper", spec: "Alignment Specialist", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Dr. John Doe", spec: "Root Canal Specialist", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Dr. Emily Rodriguez", spec: "Cosmetic Dentistry", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Dr. David Parker", spec: "Oral Hygiene Expert", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className={pageStyles.main} style={{ paddingTop: "8rem" }}>
      <section className={pageStyles.section}>
        <div className="container">
          <h1 className="heading" style={{ fontSize: "3.5rem", marginBottom: "4rem" }}>Meet Our Expert Team</h1>
          
          <div className={pageStyles.teamGrid}>
            {doctors.map((doc, idx) => (
              <div key={idx} className={`${pageStyles.teamCard} ${pageStyles.hidden}`}>
                <div className={pageStyles.teamImgWrapper}>
                  <img src={doc.img} alt={doc.name} />
                  <div className={pageStyles.teamSocials}>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
                <div className={pageStyles.teamInfo}>
                  <h3>{doc.name}</h3>
                  <p>{doc.spec}</p>
                </div>
              </div>
            ))}
          </div>

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
