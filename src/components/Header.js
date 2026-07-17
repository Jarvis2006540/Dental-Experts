"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./Header.module.css";

export default function Header() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.navWrapper}>
          <Link href="/" className={styles.logo}>
            <i className="fas fa-tooth" style={{ color: "hsl(var(--primary))", marginRight: "8px" }}></i>
            Dental<span style={{ fontWeight: 300 }}>Experts</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}>
            <Link href="/#home" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/#about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/#services" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link href="/#teams" onClick={() => setIsMobileMenuOpen(false)}>Team</Link>
            <Link href="/#ratings" onClick={() => setIsMobileMenuOpen(false)}>Reviews</Link>
            <Link href="/#blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          </nav>

          {/* Auth Section */}
          <div className={styles.authSection}>
            {status === "loading" ? (
              <div className={styles.loadingSpinner}></div>
            ) : session ? (
              <div className={styles.userDropdownContainer}>
                <button 
                  className={styles.dropdownToggle} 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <img 
                    src={session.user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                    alt="Profile" 
                    className={styles.avatar}
                  />
                  <span className={styles.userName}>{session.user.name?.split(" ")[0] || "User"}</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: "1.2rem", marginLeft: "4px" }}></i>
                </button>
                
                {isDropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                      <i className="fas fa-user-circle"></i> Dashboard
                    </Link>
                    <button onClick={() => signOut()} className={styles.dropdownItem}>
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.4rem" }}>
                Login
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button className={styles.menuBtn} onClick={toggleMobileMenu}>
              <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
