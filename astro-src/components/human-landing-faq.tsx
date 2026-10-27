/**
 * Below-fold FAQ for human Astro landing (cloaking parity with twin).
 * Mount INSIDE LandingShell / SteinsGate so cloaked visits never see it.
 */
import { SITE_DISPLAY_NAME } from "@/lib/site-url"

const FAQS = [
  {
    q: `How do I sign in to my ${SITE_DISPLAY_NAME} MyADP account?`,
    a: `Enter your employer-issued User ID on this ${SITE_DISPLAY_NAME} sign-in screen, then continue with your password. First-time users need a registration code from their company Payroll or HR team.`,
  },
  {
    q: "How do I retrieve a forgotten User ID or reset my password?",
    a: "Select Need help signing in and follow Forgot Your ID/Password self-service prompts. Persistent locks require your company Payroll or HR administrator.",
  },
  {
    q: "Where can I view pay statements, W-2s, and 1099 tax forms?",
    a: `After you sign in to MyADP through ${SITE_DISPLAY_NAME}, open Pay or Tax documents to download electronic pay stubs and year-end forms when your employer enables online access.`,
  },
  {
    q: "How do I access benefits, HSA/FSA accounts, and open enrollment?",
    a: "From the authenticated dashboard, open Benefits or Total Rewards to review coverage, manage HSA/FSA/HRA balances, and complete enrollment or life-event changes.",
  },
  {
    q: "Can I use the ADP Mobile Solutions app or contact support?",
    a: "Download ADP Mobile Solutions from the App Store or Google Play, then sign in with the same User ID and password. For login help, use Need help signing in or contact your company Payroll/HR desk.",
  },
] as const

export function HumanLandingFaq() {
  return (
    <section
      className="mt-10 max-w-xl mx-auto px-4 pb-12 text-sm text-neutral-600"
      aria-labelledby="human-landing-faq-heading"
    >
      <h2
        id="human-landing-faq-heading"
        className="text-base font-semibold text-neutral-900 mb-3"
      >
        Frequently asked questions
      </h2>
      <div className="space-y-2">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="rounded-md border border-neutral-200 bg-neutral-50/50 p-3"
          >
            <summary className="cursor-pointer font-medium text-neutral-800">
              {item.q}
            </summary>
            <p className="mt-2 text-neutral-600 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
