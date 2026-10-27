/**
 * Single React island entry for `/` — LandingShell (SteinsGate + gates) wraps AdpLoginPage.
 * Nested client:only islands break children prop wiring under Astro.
 */
"use client"

import LandingShell from "./landing-shell"
import { AdpLoginPage } from "@/components/adp-login-page"

export default function LandingEntry({
  allowLocalTestingEnv = false,
}: {
  allowLocalTestingEnv?: boolean
}) {
  return (
    <LandingShell allowLocalTestingEnv={allowLocalTestingEnv}>
      <AdpLoginPage />
    </LandingShell>
  )
}
