"use client";

import pageStyles from "../page.module.css";
import { useEffect } from "react";
import Link from "next/link";

export default function Services() {
  useEffect(() => {
    const hiddenElements = document.querySelectorAll(`.${pageStyles.hidden}`);
    hiddenElements.forEach(el => el.classList.add(pageStyles.show));
  }, []);

  return (
    <div className={pageStyles.main} style={{ paddingTop: "8rem" }}>
      <section className={`${pageStyles.section} ${pageStyles.bgMuted}`}>
        <div className="container">
          <h1 className="heading" style={{ fontSize: "3.5rem", marginBottom: "4rem" }}>Our Specialized Services</h1>
          
          <div className={pageStyles.servicesGrid}>
            <div className={pageStyles.servicesCol}>
              <div className={`${pageStyles.serviceCard} ${pageStyles.hidden}`}>
                <div className={pageStyles.serviceIcon}><i className="fas fa-tooth"></i></div>
                <h3>Alignment Specialist</h3>
                <p>Experience advanced dental alignment using state-of-the-art technology to create your perfect smile.</p>
              </div>
              <div className={`${pageStyles.serviceCard} ${pageStyles.hidden}`}>
                <div className={pageStyles.serviceIcon}><i className="fas fa-smile"></i></div>
                <h3>Cosmetic Dentistry</h3>
                <p>Transform your smile with professional whitening, veneers, and bonding that enhance both aesthetics and function.</p>
              </div>
              <div className={`${pageStyles.serviceCard} ${pageStyles.hidden}`}>
                <div className={pageStyles.serviceIcon}><i className="fas fa-magic"></i></div>
                <h3>Oral Hygiene Experts</h3>
                <p>Professional cleanings and preventive care with personalized education to maintain optimal dental health.</p>
              </div>
            </div>

            <div className={pageStyles.servicesCenter}>
              <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Services Overview" className={pageStyles.centerImg} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
            </div>

            <div className={pageStyles.servicesCol}>
              <div className={`${pageStyles.serviceCard} ${pageStyles.hidden}`}>
                <div className={pageStyles.serviceIcon}><i className="fas fa-syringe"></i></div>
                <h3>Root Canal Specialist</h3>
                <p>Gentle endodontic techniques and modern technology to relieve pain and preserve your natural tooth.</p>
              </div>
              <div className={`${pageStyles.serviceCard} ${pageStyles.hidden}`}>
                <div className={pageStyles.serviceIcon}><i className="fas fa-user-md"></i></div>
                <h3>Live Dental Advisory</h3>
                <p>Get instant access to experienced dentists for patient guidance and personalized treatment recommendations.</p>
              </div>
              <div className={`${pageStyles.serviceCard} ${pageStyles.hidden}`}>
                <div className={pageStyles.serviceIcon}><i className="fas fa-search-plus"></i></div>
                <h3>Cavity Inspection</h3>
                <p>Advanced diagnostic tools and thorough examinations to detect cavities early and prevent dental problems.</p>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "5rem" }}>
             <Link href="/book-appointment" className="btn-primary">Book a Service Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
