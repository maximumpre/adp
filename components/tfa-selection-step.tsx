"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Smartphone, ShieldCheck } from "lucide-react"
import { LOGIN_SESSION } from "@/lib/login-flow"

interface TFASelectionStepProps {
  onSubmit: (method: "email" | "sms", remember: boolean) => void | Promise<void>
  isLocked?: boolean
}

export function TFASelectionStep({
  onSubmit,
  isLocked = false,
}: TFASelectionStepProps) {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<"email" | "sms" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const busy = isLoading || isLocked

  const goToSignIn = () => {
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMethod || busy) return

    setIsLoading(true)

    if (typeof window !== "undefined") {
      sessionStorage.setItem(LOGIN_SESSION.method, selectedMethod)
    }

    try {
      await onSubmit(selectedMethod, false)
    } catch (error) {
      console.error("Failed to continue verification method:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const options: {
    id: "email" | "sms"
    title: string
    description: string
    Icon: typeof Mail
  }[] = [
    {
      id: "email",
      title: "Email",
      description: "We'll send a 6-digit code to your registered email address.",
      Icon: Mail,
    },
    {
      id: "sms",
      title: "Text message",
      description: "We'll send a 6-digit code to your mobile number on file.",
      Icon: Smartphone,
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="verification-form">
      <button
        type="button"
        onClick={goToSignIn}
        disabled={busy}
        className="back-link"
      >
        ‹ Back to sign in
      </button>

      <fieldset className={`method-list ${busy ? "is-disabled" : ""}`}>
        <legend className="sr-only">Choose a verification method</legend>

        {options.map((option) => {
          const isSelected = selectedMethod === option.id
          const Icon = option.Icon

          return (
            <label
              key={option.id}
              className={`method-card ${isSelected ? "method-card-selected" : ""}`}
            >
              <input
                type="radio"
                name="tfa-method"
                value={option.id}
                checked={isSelected}
                onChange={() => setSelectedMethod(option.id)}
                disabled={busy}
                className="method-radio"
              />
              <span className="method-icon" aria-hidden>
                <Icon size={20} />
              </span>
              <span className="method-copy">
                <span className="method-title">{option.title}</span>
                <span className="method-description">{option.description}</span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <div className="security-note">
        <ShieldCheck size={16} aria-hidden />
        <span>
          For your security, this code expires in a few minutes and can only be used once.
        </span>
      </div>

      <div className="action-stack">
        <button type="submit" disabled={!selectedMethod || busy} className="btn-primary">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
          ) : null}
          {busy ? "Continuing..." : "Continue"}
        </button>

        <button
          type="button"
          onClick={goToSignIn}
          disabled={busy}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>

      <style jsx>{`
        .verification-form {
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

        .back-link:hover {
          text-decoration: underline;
        }

        .back-link:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .method-list {
          border: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .method-list.is-disabled {
          opacity: 0.65;
          pointer-events: none;
        }

        .method-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          border: 1.5px solid #e4e4e7;
          border-radius: 10px;
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            box-shadow 0.15s ease,
            background-color 0.15s ease;
        }

        .method-card:hover {
          border-color: #93c5fd;
          background: #f8fbff;
        }

        .method-card-selected {
          border-color: #0046be;
          background: #f0f6ff;
          box-shadow: 0 0 0 3px rgba(0, 70, 190, 0.1);
        }

        .method-radio {
          margin-top: 4px;
          accent-color: #0046be;
        }

        .method-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          background: #e8f0fe;
          color: #0046be;
          flex-shrink: 0;
        }

        .method-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .method-title {
          font-size: 15px;
          font-weight: 600;
          color: #18181b;
        }

        .method-description {
          font-size: 13px;
          color: #71717a;
          line-height: 1.45;
        }

        .security-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 8px;
          background: #f4f4f5;
          color: #52525b;
          font-size: 12px;
          line-height: 1.45;
        }

        .action-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 4px;
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

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </form>
  )
}
