"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";
import Modal from "../../components/Modal";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [activeReport, setActiveReport] = useState(null);
  const [reviewDoctor, setReviewDoctor] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const [apptRes, reportRes] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/reports")
      ]);
      
      if (apptRes.ok) {
        const apptData = await apptRes.json();
        setAppointments(apptData.appointments || []);
      }
      
      if (reportRes.ok) {
        const reportData = await reportRes.json();
        setReports(reportData.reports || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
        const res = await fetch("/api/appointments", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: "Cancelled" })
        });

        if (res.ok) {
            // Update local state
            setAppointments(appointments.map(appt => 
                appt.id === id ? { ...appt, status: "Cancelled" } : appt
            ));
        } else {
            const data = await res.json();
            alert(data.error || "Failed to cancel appointment");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred while cancelling.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_name: reviewDoctor, ...reviewData })
      });
      if (res.ok) {
        alert("Review submitted successfully!");
        setReviewDoctor(null);
        setReviewData({ rating: 5, comment: "" });
      } else {
        alert("Failed to submit review");
      }
    } catch (err) {
      alert("Error submitting review");
    }
  };

  if (status === "loading" || loading) {
    return <div className="container" style={{ padding: "12rem 0", textAlign: "center" }}>Loading Dashboard...</div>;
  }

  if (!session) return null; // Will redirect

  return (
    <div className={styles.dashboardContainer}>
      <div className="container">
        <h1 className="heading">User Dashboard</h1>

        <div className={styles.dashboardGrid}>
          {/* Profile Card */}
          <div className={styles.card}>
            <div className={styles.profileHeader}>
              <img 
                src={session.user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                alt="Profile" 
                className={styles.avatar} 
              />
              <h2>{session.user.name}</h2>
              <p>{session.user.email}</p>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoItem}>
                <span>Age</span>
                <strong>{session.user.age || "Not set"}</strong>
              </div>
              <div className={styles.infoItem}>
                <span>Blood Group</span>
                <strong>{session.user.blood_type || "Not set"}</strong>
              </div>
              <div className={styles.infoItem}>
                <span>Gender</span>
                <strong>{session.user.gender || "Not set"}</strong>
              </div>
            </div>
            
            <button className="btn-primary" style={{ width: "100%", marginTop: "2rem" }}>Edit Profile</button>
          </div>

          <div className={styles.rightCol}>
            {/* Appointments Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>My Appointments</h3>
                <Link href="/book-appointment" className={styles.addBtn}><i className="fas fa-plus"></i> Book</Link>
              </div>
              <div className={styles.listContainer}>
                {appointments.length > 0 ? (
                  appointments.map(appt => (
                    <div key={appt.id} className={styles.listItem}>
                      <div className={styles.itemIcon}><i className="fas fa-calendar-alt"></i></div>
                      <div className={styles.itemDetails}>
                        <h4>{appt.doctor}</h4>
                        <p>{appt.appointment_date}</p>
                      </div>
                      <div className={styles.itemStatus} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span className={`${styles.statusBadge} ${styles[appt.status.toLowerCase()] || styles.scheduled}`}>
                          {appt.status}
                        </span>
                        {appt.status === 'Scheduled' && (
                           <button 
                             onClick={() => handleCancelAppointment(appt.id)}
                             style={{
                               background: 'none', border: 'none', color: 'hsl(var(--destructive))',
                               cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline'
                             }}
                           >
                             Cancel
                           </button>
                        )}
                        {appt.status === 'Completed' && (
                           <button 
                             onClick={() => setReviewDoctor(appt.doctor)}
                             style={{
                               background: 'none', border: 'none', color: 'hsl(var(--primary))',
                               cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline'
                             }}
                           >
                             Leave Review
                           </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyState}>No appointments found.</p>
                )}
              </div>
            </div>

            {/* Reports Card */}
            <div className={styles.card} style={{ marginTop: "2rem" }}>
              <div className={styles.cardHeader}>
                <h3>My Medical Reports</h3>
              </div>
              <div className={styles.listContainer}>
                {reports.length > 0 ? (
                  reports.map(report => (
                    <div key={report.id} className={styles.listItem}>
                      <div className={styles.itemIcon} style={{ background: "hsla(210, 100%, 50%, 0.1)", color: "hsl(210, 100%, 50%)" }}>
                        <i className="fas fa-file-medical"></i>
                      </div>
                      <div className={styles.itemDetails}>
                        <h4>{report.title}</h4>
                        <p>Dr. {report.doctor_name} - {new Date(report.report_date).toLocaleDateString()}</p>
                      </div>
                      <button className={styles.viewBtn} onClick={() => setActiveReport(report)}>View</button>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyState}>No medical reports available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!activeReport} onClose={() => setActiveReport(null)} title={activeReport?.title || "Medical Report"}>
        {activeReport && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ fontSize: "1.4rem", color: "hsl(var(--primary))", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ddd", paddingBottom: "1rem" }}>
              <span><strong>Doctor:</strong> Dr. {activeReport.doctor_name}</span>
              <span><strong>Date:</strong> {new Date(activeReport.report_date).toLocaleDateString()}</span>
            </div>
            <div style={{ fontSize: "1.6rem", lineHeight: "1.8", color: "hsl(var(--text-main))", whiteSpace: "pre-wrap" }}>
              {activeReport.content_or_link.startsWith("http") ? (
                <a href={activeReport.content_or_link} target="_blank" rel="noopener noreferrer" style={{ color: "hsl(var(--primary))", textDecoration: "underline" }}>Download / View Report File</a>
              ) : (
                activeReport.content_or_link
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!reviewDoctor} onClose={() => setReviewDoctor(null)} title={`Review Dr. ${reviewDoctor}`}>
        <form onSubmit={submitReview} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "1rem", fontSize: "1.4rem", fontWeight: "bold" }}>Rating (1-5)</label>
            <input type="number" min="1" max="5" value={reviewData.rating} onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})} required style={{ width: "100%", padding: "1rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1.6rem" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "1rem", fontSize: "1.4rem", fontWeight: "bold" }}>Comment</label>
            <textarea value={reviewData.comment} onChange={(e) => setReviewData({...reviewData, comment: e.target.value})} style={{ width: "100%", padding: "1rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1.6rem", minHeight: "100px", resize: "vertical" }} placeholder="Share your experience..."></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1.2rem", fontSize: "1.6rem" }}>Submit Review</button>
        </form>
      </Modal>

    </div>
  );
}
