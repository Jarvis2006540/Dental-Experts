"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";
import Link from "next/link";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/admin/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch("/api/admin/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });

      if (res.ok) {
        // Optimistically update
        setAppointments(appointments.map(appt => 
          appt.id === id ? { ...appt, status: newStatus } : appt
        ));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (status === "loading" || loading) {
    return <div className="container" style={{ padding: "12rem 0", textAlign: "center" }}>Loading Admin Dashboard...</div>;
  }

  if (!session) return null;

  const filteredAppointments = appointments.filter(appt => {
    if (filter === "all") return true;
    return appt.status.toLowerCase() === filter;
  });

  return (
    <div className={styles.adminContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <i className="fas fa-tooth"></i>
          <span>Admin</span>
        </div>
        <nav className={styles.sidebarNav}>
          <a href="#" className={styles.activeLink}><i className="fas fa-calendar-check"></i> Appointments</a>
          <a href="#"><i className="fas fa-users"></i> Patients</a>
          <a href="#"><i className="fas fa-file-medical"></i> Reports</a>
          <a href="#"><i className="fas fa-cog"></i> Settings</a>
        </nav>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className="heading" style={{ margin: 0, textAlign: "left", fontSize: "2.4rem" }}>Manage Appointments</h1>
          <div className={styles.headerProfile}>
            <span>Admin, {session.user.name}</span>
            <img src={session.user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Admin Avatar" />
          </div>
        </header>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "hsla(210, 100%, 50%, 0.1)", color: "hsl(210, 100%, 50%)" }}>
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className={styles.statInfo}>
              <h3>Total</h3>
              <p>{appointments.length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "hsla(38, 92%, 50%, 0.1)", color: "hsl(38, 92%, 50%)" }}>
              <i className="fas fa-clock"></i>
            </div>
            <div className={styles.statInfo}>
              <h3>Scheduled</h3>
              <p>{appointments.filter(a => a.status === "Scheduled").length}</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: "hsla(140, 60%, 50%, 0.1)", color: "hsl(140, 60%, 40%)" }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div className={styles.statInfo}>
              <h3>Completed</h3>
              <p>{appointments.filter(a => a.status === "Completed").length}</p>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <h2>All Appointments</h2>
            <div className={styles.filterGroup}>
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appt => (
                  <tr key={appt.id}>
                    <td>
                      <div className={styles.patientInfo}>
                        <strong>{appt.name}</strong>
                        <span>{appt.email}</span>
                      </div>
                    </td>
                    <td>{appt.doctor}</td>
                    <td>{new Date(appt.appointment_date).toLocaleString()}</td>
                    <td>{appt.phone}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[appt.status.toLowerCase()] || styles.scheduled}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        {appt.status !== 'Completed' && (
                          <button 
                            className={styles.actionBtn} 
                            style={{ color: "hsl(140, 60%, 40%)" }}
                            onClick={() => updateStatus(appt.id, 'Completed')}
                            title="Mark Completed"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        )}
                        {appt.status !== 'Cancelled' && (
                          <button 
                            className={styles.actionBtn} 
                            style={{ color: "hsl(0, 70%, 50%)" }}
                            onClick={() => updateStatus(appt.id, 'Cancelled')}
                            title="Cancel Appointment"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "hsl(var(--text-muted))" }}>
                    No appointments found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
