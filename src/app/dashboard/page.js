"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
                        <p>{new Date(appt.appointment_date).toLocaleString()}</p>
                      </div>
                      <div className={styles.itemStatus}>
                        <span className={`${styles.statusBadge} ${styles[appt.status.toLowerCase()] || styles.scheduled}`}>
                          {appt.status}
                        </span>
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
                      <button className={styles.viewBtn}>View</button>
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
    </div>
  );
}
