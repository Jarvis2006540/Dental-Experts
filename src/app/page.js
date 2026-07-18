"use client";

import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";

export default function Home() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Simple intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.show);
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll(`.${styles.hidden}`);
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.main}>
      
      {/* HERO SECTION */}
      <section id="home" className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              We are best <br/> <span style={{ color: "hsl(var(--primary))" }}>Dental Services</span>
            </h1>
            <p className={styles.heroText}>
              Welcome to our dental experts, where we combine advanced technology with compassionate care to deliver exceptional oral health solutions. Our team of experienced professionals is dedicated to providing personalized treatment plans and ensuring your comfort while creating the beautiful, healthy smile you deserve.
            </p>
            <Link href="/book-appointment" className="btn-primary" style={{ marginTop: "2rem" }}>
              Book Appointment <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className={`${styles.section} ${styles.aboutSection}`}>
        <div className={`container ${styles.grid2}`}>
          <div className={`${styles.aboutImage} ${styles.hidden}`}>
            <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Dental Clinic" />
          </div>
          <div className={`${styles.aboutContent} ${styles.hidden}`}>
            <span className={styles.tag}>About Us</span>
            <h2 className="heading" style={{ textAlign: "left", marginBottom: "1.5rem" }}>True Healthcare For Your Family</h2>
            <p>
              We understand that every family member has unique dental needs, which is why we provide comprehensive care tailored to patients of all ages, from children to seniors. Our modern facility is equipped with cutting-edge technology and staffed by gentle, experienced professionals who prioritize your family's comfort and well-being, ensuring a positive dental experience for everyone.
            </p>
            <button onClick={() => setIsAboutModalOpen(true)} className="btn-primary" style={{ marginTop: "1rem" }}>Read More</button>
          </div>
        </div>
      </section>

      <Modal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} title="About Dental Experts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Clinic" style={{ width: '100%', borderRadius: '10px', height: '300px', objectFit: 'cover' }} />
          <p>
            We understand that every family member has unique dental needs, which is why we provide comprehensive care tailored to patients of all ages, from children to seniors. Our modern facility is equipped with cutting-edge technology and staffed by gentle, experienced professionals who prioritize your family's comfort and well-being, ensuring a positive dental experience for everyone.
          </p>
          <p>
            Founded in 1995, Dental Experts has grown from a single-chair practice to a multi-specialty clinic serving thousands of patients annually. Our commitment to continuing education means our team is always at the forefront of dental advancements.
          </p>
          <p>
            Whether you need a routine cleaning, complex restorative work, or a complete cosmetic makeover, we take the time to listen to your concerns and design a treatment plan that fits your lifestyle and budget.
          </p>
        </div>
      </Modal>

      {/* SERVICES SECTION */}
      <section id="services" className={`${styles.section} ${styles.bgMuted}`}>
        <div className="container">
          <h2 className="heading">Our Services</h2>
          <div className={styles.servicesGrid}>
            
            <div className={styles.servicesCol}>
              <div className={`${styles.serviceCard} ${styles.hidden}`}>
                <div className={styles.serviceIcon}><i className="fas fa-tooth"></i></div>
                <h3>Alignment Specialist</h3>
                <p>Experience advanced dental alignment using state-of-the-art technology to create your perfect smile.</p>
              </div>
              <div className={`${styles.serviceCard} ${styles.hidden}`}>
                <div className={styles.serviceIcon}><i className="fas fa-smile"></i></div>
                <h3>Cosmetic Dentistry</h3>
                <p>Transform your smile with professional whitening, veneers, and bonding that enhance both aesthetics and function.</p>
              </div>
              <div className={`${styles.serviceCard} ${styles.hidden}`}>
                <div className={styles.serviceIcon}><i className="fas fa-magic"></i></div>
                <h3>Oral Hygiene Experts</h3>
                <p>Professional cleanings and preventive care with personalized education to maintain optimal dental health.</p>
              </div>
            </div>

            <div className={styles.servicesCenter}>
              <img src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Services Overview" className={styles.centerImg} />
            </div>

            <div className={styles.servicesCol}>
              <div className={`${styles.serviceCard} ${styles.hidden}`}>
                <div className={styles.serviceIcon}><i className="fas fa-syringe"></i></div>
                <h3>Root Canal Specialist</h3>
                <p>Gentle endodontic techniques and modern technology to relieve pain and preserve your natural tooth.</p>
              </div>
              <div className={`${styles.serviceCard} ${styles.hidden}`}>
                <div className={styles.serviceIcon}><i className="fas fa-user-md"></i></div>
                <h3>Live Dental Advisory</h3>
                <p>Get instant access to experienced dentists for patient guidance and personalized treatment recommendations.</p>
              </div>
              <div className={`${styles.serviceCard} ${styles.hidden}`}>
                <div className={styles.serviceIcon}><i className="fas fa-search-plus"></i></div>
                <h3>Cavity Inspection</h3>
                <p>Advanced diagnostic tools and thorough examinations to detect cavities early and prevent dental problems.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section id="teams" className={styles.section}>
        <div className="container">
          <h2 className="heading">Our Team</h2>
          <div className={styles.teamGrid}>
            {[
              { name: "Dr. Sarah Cooper", spec: "Alignment Specialist", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Dr. John Doe", spec: "Root Canal Specialist", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Dr. Emily Rodriguez", spec: "Cosmetic Dentistry", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
              { name: "Dr. David Parker", spec: "Oral Hygiene Expert", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
            ].map((doc, idx) => (
              <div key={idx} className={`${styles.teamCard} ${styles.hidden}`}>
                <div className={styles.teamImgWrapper}>
                  <img src={doc.img} alt={doc.name} />
                  <div className={styles.teamSocials}>
                    <a href="#"><i className="fab fa-facebook-f"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
                <div className={styles.teamInfo}>
                  <h3>{doc.name}</h3>
                  <p>{doc.spec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "3.5rem", color: "white", marginBottom: "2rem" }}>Ready to transform your smile?</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.8rem", maxWidth: "600px", margin: "0 auto 3rem" }}>
            Experience our advanced, pain-free dental treatments today. Book your slot with our experts in just a few clicks.
          </p>
          <Link href="/book-appointment" className="btn-primary" style={{ background: "white", color: "hsl(var(--primary))" }}>
            <i className="far fa-calendar-check"></i> Book Now
          </Link>
        </div>
      </section>
      
    </div>
  );
}
