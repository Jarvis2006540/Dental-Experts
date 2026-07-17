"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./book.module.css";
import Link from "next/link";

export default function BookAppointment() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    doctor: "",
    appointment_date: "",
    time: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const doctors = [
    { id: "Sarah Cooper", name: "Dr. Sarah Cooper", spec: "Alignment Specialist" },
    { id: "John Doe", name: "Dr. John Doe", spec: "Root Canal Specialist" },
    { id: "Emily Rodriguez", name: "Dr. Emily Rodriguez", spec: "Cosmetic Dentistry" },
    { id: "David Parker", name: "Dr. David Parker", spec: "Oral Hygiene Expert" }
  ];

  const timeSlots = ["09:00 AM", "10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM", "04:30 PM"];

  if (status === "loading") {
    return <div className="container" style={{ padding: "12rem 0", textAlign: "center" }}>Loading...</div>;
  }

  if (!session) {
    return (
      <div className={styles.bookingContainer}>
        <div className={styles.bookingCard}>
          <h1 className="heading">Sign In Required</h1>
          <p style={{ textAlign: "center", marginBottom: "2rem" }}>You must be logged in to book an appointment.</p>
          <Link href="/login" className="btn-primary" style={{ display: "block", textAlign: "center" }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const submitBooking = async () => {
    setLoading(true);
    setError("");
    try {
      // Combine date and time
      const dateTimeString = `${formData.appointment_date} ${formData.time}`;
      
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: formData.doctor,
          appointment_date: dateTimeString,
          phone: formData.phone
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingCard}>
        {success ? (
          <div className={styles.successState}>
            <div className={styles.successIcon}><i className="fas fa-check-circle"></i></div>
            <h2>Appointment Confirmed!</h2>
            <p>Your appointment with {formData.doctor} on {formData.appointment_date} at {formData.time} has been scheduled successfully.</p>
            <Link href="/dashboard" className="btn-primary" style={{ marginTop: "2rem" }}>Go to Dashboard</Link>
          </div>
        ) : (
          <>
            <div className={styles.stepper}>
              <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ""}`}>1. Doctor</div>
              <div className={`${styles.stepLine} ${step >= 2 ? styles.activeLine : ""}`}></div>
              <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ""}`}>2. Date & Time</div>
              <div className={`${styles.stepLine} ${step >= 3 ? styles.activeLine : ""}`}></div>
              <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ""}`}>3. Confirm</div>
            </div>

            {error && <div className={styles.errorAlert}>{error}</div>}

            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Select a Specialist</h2>
                <div className={styles.doctorGrid}>
                  {doctors.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`${styles.doctorCard} ${formData.doctor === doc.name ? styles.selectedCard : ""}`}
                      onClick={() => setFormData({...formData, doctor: doc.name})}
                    >
                      <i className="fas fa-user-md" style={{ fontSize: "3rem", color: "hsl(var(--primary))", marginBottom: "1rem" }}></i>
                      <h3>{doc.name}</h3>
                      <p>{doc.spec}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.actionRow}>
                  <div></div>
                  <button className="btn-primary" disabled={!formData.doctor} onClick={handleNext}>Next Step</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Choose Date & Time</h2>
                <div className={styles.formGroup}>
                  <label>Select Date</label>
                  <input 
                    type="date" 
                    className={styles.inputField} 
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                  />
                </div>

                {formData.appointment_date && (
                  <div className={styles.formGroup}>
                    <label>Available Time Slots</label>
                    <div className={styles.timeGrid}>
                      {timeSlots.map(time => (
                        <div 
                          key={time} 
                          className={`${styles.timeSlot} ${formData.time === time ? styles.selectedTime : ""}`}
                          onClick={() => setFormData({...formData, time})}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={styles.actionRow}>
                  <button className={styles.btnSecondary} onClick={handlePrev}>Back</button>
                  <button className="btn-primary" disabled={!formData.appointment_date || !formData.time} onClick={handleNext}>Next Step</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Confirm Details</h2>
                
                <div className={styles.summaryBox}>
                  <div className={styles.summaryItem}>
                    <span>Patient Name</span>
                    <strong>{session.user.name}</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Patient Email</span>
                    <strong>{session.user.email}</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Specialist</span>
                    <strong>{formData.doctor}</strong>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Date & Time</span>
                    <strong>{formData.appointment_date} at {formData.time}</strong>
                  </div>
                </div>

                <div className={styles.formGroup} style={{ marginTop: "2rem" }}>
                  <label>Contact Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number"
                    className={styles.inputField} 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>

                <div className={styles.actionRow}>
                  <button className={styles.btnSecondary} onClick={handlePrev}>Back</button>
                  <button className="btn-primary" disabled={!formData.phone || loading} onClick={submitBooking}>
                    {loading ? "Confirming..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
