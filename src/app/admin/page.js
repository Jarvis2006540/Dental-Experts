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
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("appointments");
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "" });
  const [staffMessage, setStaffMessage] = useState({ type: "", text: "" });

  const [newReport, setNewReport] = useState({ user_email: "", title: "", doctor_name: "", content_or_link: "" });
  const [reportMessage, setReportMessage] = useState({ type: "", text: "" });

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
      const [apptRes, staffRes, patientRes, reportRes] = await Promise.all([
        fetch("/api/admin/appointments"),
        session?.user?.role === "admin" ? fetch("/api/admin/staff") : Promise.resolve(null),
        fetch("/api/admin/patients"),
        fetch("/api/admin/reports")
      ]);
      
      if (apptRes.ok) {
        const data = await apptRes.json();
        setAppointments(data.appointments || []);
      }
      
      if (staffRes && staffRes.ok) {
        const data = await staffRes.json();
        setStaff(data.staff || []);
      }

      if (patientRes && patientRes.ok) {
        const data = await patientRes.json();
        setPatients(data.patients || []);
      }

      if (reportRes && reportRes.ok) {
        const data = await reportRes.json();
        setReports(data.reports || []);
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

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setReportMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport)
      });
      if (res.ok) {
        setReportMessage({ type: "success", text: "Report assigned successfully!" });
        setNewReport({ user_email: "", title: "", doctor_name: "", content_or_link: "" });
        fetchData();
      } else {
        setReportMessage({ type: "error", text: "Failed to assign report." });
      }
    } catch (err) {
      setReportMessage({ type: "error", text: "An error occurred." });
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
          <a href="#" className={activeTab === "appointments" ? styles.activeLink : ""} onClick={(e) => {e.preventDefault(); setActiveTab("appointments");}}><i className="fas fa-calendar-check"></i> Appointments</a>
          {session.user.role === "admin" && (
            <a href="#" className={activeTab === "staff" ? styles.activeLink : ""} onClick={(e) => {e.preventDefault(); setActiveTab("staff");}}><i className="fas fa-user-md"></i> Manage Staff</a>
          )}
          <a href="#" className={activeTab === "patients" ? styles.activeLink : ""} onClick={(e) => {e.preventDefault(); setActiveTab("patients");}}><i className="fas fa-users"></i> Patients</a>
          <a href="#" className={activeTab === "reports" ? styles.activeLink : ""} onClick={(e) => {e.preventDefault(); setActiveTab("reports");}}><i className="fas fa-file-medical"></i> Reports</a>
          <a href="#"><i className="fas fa-cog"></i> Settings</a>
        </nav>
      </div>

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className="heading" style={{ margin: 0, textAlign: "left", fontSize: "2.4rem", textTransform: "capitalize" }}>
            Manage {activeTab}
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
        ) : activeTab === "staff" && session.user.role === "admin" ? (
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
        ) : activeTab === "patients" ? (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2>Registered Patients</h2>
            </div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? patients.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.email}</td>
                    <td>{p.phone || "N/A"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ textAlign: "center", padding: "2rem" }}>No patients found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === "reports" ? (
          <div className={styles.tableContainer}>
            <div className={styles.tableHeader}>
              <h2>Upload Medical Report</h2>
            </div>
            <div style={{ padding: "2rem" }}>
              {reportMessage.text && (
                <div style={{ 
                  padding: "1rem", 
                  marginBottom: "2rem", 
                  borderRadius: "6px", 
                  background: reportMessage.type === "success" ? "#dcfce7" : "#fee2e2",
                  color: reportMessage.type === "success" ? "#166534" : "#991b1b"
                }}>
                  {reportMessage.text}
                </div>
              )}
              
              <form onSubmit={handleCreateReport} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end", marginBottom: "3rem" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Patient Email</label>
                  <input type="email" value={newReport.user_email} onChange={e => setNewReport({...newReport, user_email: e.target.value})} required style={{ width: "100%", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }} placeholder="patient@example.com" />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Report Title</label>
                  <input type="text" value={newReport.title} onChange={e => setNewReport({...newReport, title: e.target.value})} required style={{ width: "100%", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }} placeholder="X-Ray Results" />
                </div>
                <div style={{ flex: "1 1 300px" }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Content or File Link</label>
                  <input type="text" value={newReport.content_or_link} onChange={e => setNewReport({...newReport, content_or_link: e.target.value})} required style={{ width: "100%", padding: "1rem", border: "1px solid #ccc", borderRadius: "6px" }} placeholder="Diagnosis details or https://..." />
                </div>
                <button type="submit" className="btn-primary" style={{ padding: "1rem 2rem", height: "46px" }}>Assign Report</button>
              </form>

              <h3>Recent Reports</h3>
              <table className={styles.table} style={{ marginTop: "1rem" }}>
                <thead>
                  <tr>
                    <th>Patient Email</th>
                    <th>Title</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length > 0 ? reports.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.user_email}</strong></td>
                      <td>{r.title}</td>
                      <td>{new Date(r.report_date).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" style={{ textAlign: "center", padding: "2rem" }}>No reports found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
