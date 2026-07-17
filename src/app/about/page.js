"use client";

import Link from "next/link";
import pageStyles from "../page.module.css";
import { useEffect } from "react";

export default function About() {
  useEffect(() => {
    const hiddenElements = document.querySelectorAll(`.${pageStyles.hidden}`);
    hiddenElements.forEach(el => el.classList.add(pageStyles.show));
  }, []);

  return (
    <div className={pageStyles.main} style={{ paddingTop: "10rem" }}>
      <section className={pageStyles.section}>
        <div className={`container ${pageStyles.grid2}`}>
          <div className={`${pageStyles.aboutImage} ${pageStyles.hidden}`}>
            <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dental Clinic" />
          </div>
          <div className={`${pageStyles.aboutContent} ${pageStyles.hidden}`}>
            <span className={pageStyles.tag}>About Us</span>
            <h1 className="heading" style={{ textAlign: "left", marginBottom: "1.5rem" }}>True Healthcare For Your Family</h1>
            <p style={{ fontSize: "1.6rem", lineHeight: "1.8", color: "hsl(var(--text-muted))", marginBottom: "2rem" }}>
              We understand that every family member has unique dental needs, which is why we provide comprehensive care tailored to patients of all ages, from children to seniors. Our modern facility is equipped with cutting-edge technology and staffed by gentle, experienced professionals who prioritize your family's comfort and well-being, ensuring a positive dental experience for everyone.
            </p>
            <p style={{ fontSize: "1.6rem", lineHeight: "1.8", color: "hsl(var(--text-muted))", marginBottom: "3rem" }}>
              Since our founding, we've been dedicated to one simple mission: providing the highest standard of dental care in a relaxed, state-of-the-art environment. Our team continuously undergoes rigorous training to stay abreast of the latest advancements in dentistry.
            </p>
            <Link href="/contact" className="btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
