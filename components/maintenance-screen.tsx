import { Construction, Wrench } from "lucide-react"
import { AdpLogo } from "@/components/adp-logo"
import {
  MAINTENANCE_MESSAGE,
  MAINTENANCE_SUBTITLE,
  MAINTENANCE_THEME_COLOR,
} from "@/lib/maintenance"

export function MaintenanceScreen() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <hr
        className="h-1 w-full border-0"
        style={{ backgroundColor: MAINTENANCE_THEME_COLOR }}
        aria-hidden
      />

      <header className="flex justify-center px-6 pt-10">
        <AdpLogo />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div
          className="relative mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-slate-50 animate-pulse"
          aria-hidden
        >
          <Construction
            className="h-14 w-14"
            style={{ color: MAINTENANCE_THEME_COLOR }}
            strokeWidth={1.75}
          />
          <Wrench
            className="absolute -bottom-1 -right-1 h-8 w-8 animate-bounce text-slate-500"
            strokeWidth={2}
          />
        </div>

        <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          {MAINTENANCE_MESSAGE}
        </h1>
        <p className="max-w-md text-base leading-relaxed text-slate-600">
          {MAINTENANCE_SUBTITLE}
        </p>
      </main>

      <footer className="border-t border-slate-200 px-6 py-6 text-center text-xs text-slate-500">
        <div className="mb-2 flex flex-wrap justify-center gap-x-5 gap-y-2 font-medium uppercase tracking-wide">
          <a className="hover:underline" href="#">
            Privacy
          </a>
          <a className="hover:underline" href="#">
            Legal
          </a>
          <a className="hover:underline" href="#">
            AI Transparency
          </a>
        </div>
        <div>© 2014-2026 ADP, Inc.</div>
      </footer>
    </div>
  )
}
