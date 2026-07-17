"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./Login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("user"); // "user" or "admin"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      const session = await getSession();
      if (session?.user?.role === "admin" || session?.user?.role === "staff") {
        router.push("/admin");
      } else {
        if (loginType === "admin") {
          // They tried to login as admin but are just a user
          setError("You do not have admin/staff privileges.");
          setLoading(false);
        } else {
          router.push("/dashboard");
        }
      }
    }
  };

  const handleGoogleSignIn = async () => {
    // NextAuth google signin usually redirects, so we let it handle redirect automatically,
    // but ideally we'd want to route them based on role. 
    // We will let the dashboard or admin page handle unauthorized kicks.
    signIn("google", { callbackUrl: loginType === "admin" ? "/admin" : "/dashboard" });
  };

  return (
    <div className={styles.authContainer} style={{ minHeight: "100vh", paddingTop: "10rem", paddingBottom: "5rem" }}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your Dental Experts account</p>
        
        {/* Toggle Switch */}
        <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "8px", padding: "4px", marginBottom: "2rem" }}>
          <button 
            type="button"
            onClick={() => setLoginType("user")}
            style={{ flex: 1, padding: "1rem", border: "none", borderRadius: "6px", background: loginType === "user" ? "white" : "transparent", color: loginType === "user" ? "var(--primary-color)" : "#64748b", fontWeight: loginType === "user" ? "bold" : "normal", boxShadow: loginType === "user" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}
          >
            Patient Login
          </button>
          <button 
            type="button"
            onClick={() => setLoginType("admin")}
            style={{ flex: 1, padding: "1rem", border: "none", borderRadius: "6px", background: loginType === "admin" ? "white" : "transparent", color: loginType === "admin" ? "var(--primary-color)" : "#64748b", fontWeight: loginType === "admin" ? "bold" : "normal", boxShadow: loginType === "admin" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}
          >
            Admin / Staff
          </button>
        </div>

        {error && <div className={styles.errorAlert} style={{ color: "red", background: "#fee2e2", padding: "1rem", borderRadius: "6px", marginBottom: "1.5rem" }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <i className="fas fa-envelope"></i>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <i className="fas fa-lock"></i>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in..." : (loginType === "admin" ? "Access Dashboard" : "Login")}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button onClick={handleGoogleSignIn} className={styles.googleBtn} style={{ width: "100%", padding: "1.2rem", background: "white", border: "1px solid #ddd", borderRadius: "6px", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", cursor: "pointer", fontSize: "1.5rem", marginBottom: "2rem" }}>
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" style={{ width: "20px" }} />
          Continue with Google
        </button>

        {loginType === "user" && (
          <p className={styles.footerText} style={{ textAlign: "center", fontSize: "1.4rem" }}>
            Don't have an account? <Link href="/signup" style={{ color: "hsl(var(--primary))", fontWeight: "bold" }}>Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
}
