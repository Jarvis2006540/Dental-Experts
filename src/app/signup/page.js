"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Signup.module.css";
import loginStyles from "../login/Login.module.css"; // Reuse some styles

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    bloodGroup: "",
    gender: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        router.push("/login?registered=true");
      }
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.authContainer}>
      <div className={loginStyles.authBox} style={{ maxWidth: "550px" }}>
        <h1 className={loginStyles.title}>Create Account</h1>
        <p className={loginStyles.subtitle}>Join Dental Experts today</p>
        
        {error && <div className={loginStyles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={loginStyles.form}>
          <div className={styles.gridContainer}>
            {/* Required Fields */}
            <div className={loginStyles.inputGroup}>
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                name="name"
                placeholder="Full Name *" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className={loginStyles.inputGroup}>
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                name="email"
                placeholder="Email Address *" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className={loginStyles.inputGroup}>
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                name="password"
                placeholder="Password *" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className={loginStyles.inputGroup}>
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password *" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Optional Fields */}
            <div className={loginStyles.inputGroup}>
              <i className="fas fa-calendar-alt"></i>
              <input 
                type="number" 
                name="age"
                placeholder="Age (Optional)" 
                min="1" max="120"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div className={styles.selectGroup}>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                <option value="">Blood Group (Optional)</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>

            <div className={styles.selectGroup}>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Gender (Optional)</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className={loginStyles.footerText}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
