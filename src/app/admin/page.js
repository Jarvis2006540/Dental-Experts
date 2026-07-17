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
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" or "staff"
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "" });
  const [staffMessage, setStaffMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      if (session?.user?.role !== "admin" && session?.user?.role !== "staff") {
        router.push("/dashboard"); // Kick out regular users
      } else {
        fetchData();
      }
    }
  }, [status, session, router]);

  const fetchData = async () => {
    try {
      const [apptRes, staffRes] = await Promise.all([
        fetch("/api/admin/appointments"),
        session?.user?.role === "admin" ? fetch("/api/admin/staff") : Promise.resolve(null)
      ]);
      
      if (apptRes.ok) {
        const data = await apptRes.json();
        setAppointments(data.appointments || []);
      }
      
      if (staffRes && staffRes.ok) {
        const data = await staffRes.json();
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
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

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setStaffMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff)
      });
      const data = await res.json();
      if (res.ok) {
        setStaffMessage({ type: "success", text: "Staff member created successfully!" });
        setNewStaff({ name: "", email: "", password: "" });
        fetchData(); // Refresh list
      } else {
        setStaffMessage({ type: "error", text: data.error || "Failed to create staff" });
      }
    } catch (err) {
      setStaffMessage({ type: "error", text: "An error occurred." });
    }
  };

  if (status === "loading" || loading) {
    return <div className="container" style={{ padding: "12rem 0", textAlign: "center" }}>Loading Admin Dashboard...</div>;
  }

  if (!session || (session.user.role !== "admin" && session.user.role !== "staff")) return null;

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
          <a href="#" className={activeTab === "appointments" ? styles.activeLink : ""} onClick={() => setActiveTab("appointments")}><i className="fas fa-calendar-check"></i> Appointments</a>
          {session.user.role === "admin" && (
            <a href="#" className={activeTab === "staff" ? styles.activeLink : ""} onClick={() => setActiveTab("staff")}><i className="fas fa-user-md"></i> Manage Staff</a>
          )}
          <a href="#"><i className="fas fa-users"></i> Patients</a>
          <a href="#"><i className="fas fa-file-medical"></i> Reports</a>
          <a href="#"><i className="fas fa-cog"></i> Settings</a>
        </nav>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className="heading" style={{ margin: 0, textAlign: "left", fontSize: "2.4rem" }}>
            {activeTab === "appointments" ? "Manage Appointments" : "Manage Staff"}
          </h1>
          <div className={styles.headerProfile}>
            <span>{session.user.role === "admin" ? "Admin" : "Staff"}, {session.user.name}</span>
            <img src={session.user.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Admin Avatar" />
          </div>
        </header>

        {activeTab === "appointments" ? (
          <>
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
          </>
        ) : (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2>Add New Staff Member</h2>
            </div>
            
            <div style={{ padding: "2rem" }}>
              {staffMessage.text && (
                <div style={{ 
                  padding: "1rem", 
                  marginBottom: "2rem", 
                  borderRadius: "6px", 
                  background: staffMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                  color: staffMessage.type === "success" ? "#166534" : "#991b1b"
                }}>
                  {staffMessage.text}
                </div>
              )}
              
              <form onSubmit={handleCreateStaff} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "3rem" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Name</label>
                  <input type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required style={{ width: "100%", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }} placeholder="Dr. Smith" />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Email</label>
                  <input type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} required style={{ width: "100%", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }} placeholder="staff@example.com" />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Password</label>
                  <input type="password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} required style={{ width: "100%", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }} placeholder="••••••••" />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: "1rem 2rem", height: "46px" }}>Add Staff</button>
              </form>

              <h3>Current Staff Members</h3>
              <table className={styles.table} style={{ marginTop: "1rem" }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.length > 0 ? staff.map(s => (
                    <tr key={s.id}>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.email}</td>
                      <td><span className={styles.statusBadge} style={{ background: "hsla(210, 100%, 50%, 0.1)", color: "hsl(210, 100%, 50%)" }}>{s.role}</span></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" style={{ textAlign: "center", padding: "2rem" }}>No staff members created yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
