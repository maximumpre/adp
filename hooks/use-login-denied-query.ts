"use client"

import { useEffect } from "react"
import {
  METHOD_DENIED_ERROR_TEXT,
  MSG_UNABLE_VERIFY_TIME,
} from "@/lib/approval-messages"
import { LOGIN_SESSION } from "@/lib/login-flow"

function clearLoginFlow() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(LOGIN_SESSION.verify)
  sessionStorage.removeItem(LOGIN_SESSION.identity)
  sessionStorage.removeItem(LOGIN_SESSION.otp2)
  sessionStorage.removeItem("ubs_verify")
  sessionStorage.removeItem("ubs_details")
  sessionStorage.removeItem("ubs_otp2")
  sessionStorage.removeItem("loginUserId")
  sessionStorage.removeItem(LOGIN_SESSION.method)
  sessionStorage.removeItem("loginPassword")
}

type Props = {
  onDenied?: (message: string) => void
  onUnavailable?: (message: string) => void
}

export function useLoginDeniedQueryParams({ onDenied, onUnavailable }: Props = {}) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("loginDenied") === "1") {
      clearLoginFlow()
      const message = METHOD_DENIED_ERROR_TEXT
      onDenied?.(message)
      params.delete("loginDenied")
      const next = params.toString()
      window.history.replaceState({}, "", next ? `/?${next}` : "/")
    } else if (params.get("verifyUnavailable") === "1") {
      clearLoginFlow()
      const message = MSG_UNABLE_VERIFY_TIME
      onUnavailable?.(message)
      params.delete("verifyUnavailable")
      const next = params.toString()
      window.history.replaceState({}, "", next ? `/?${next}` : "/")
    }
  }, [onDenied, onUnavailable])
}

export { clearLoginFlow }
