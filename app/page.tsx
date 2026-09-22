import { FloresLoginPage } from "@/components/flores-login-page"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login",
  description: "Secure login portal for ADP benefits account. Access your FSA, HSA, or HRA account to view balances, file claims, and manage your benefits online.",
  keywords: [
    "ADP login",
    "ADP benefits portal",
    "benefits portal login",
    "FSA account login",
    "HSA account login",
    "HRA account login",
    "employee benefits login",
    "participant login",
    "employer login",
    "benefits management",
    "file claims online"
  ],
  openGraph: {
    title: "ADP - Login to Your Benefits Account",
    description: "Secure login portal for ADP benefits account. Access your FSA, HSA, or HRA account to view balances, file claims, and manage your benefits online.",
    type: "website",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
}

export default function Page() {
  return <FloresLoginPage />
}
