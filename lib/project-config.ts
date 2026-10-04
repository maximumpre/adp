export const PROJECT_ID = "onlineadp-auth" as const

/**
 * Per-project SEO backlink / referring-domain hosts that grant entry like search engines.
 * Bare hostnames match subdomains (e.g. "linkedin.com" allows www.linkedin.com).
 * Leave empty until you have known backlinks for this site.
 */
export const ALLOWED_BACKLINK_HOSTS: string[] = []

export const PROJECT_DISPLAY_NAME = "ADP Benefits Login"

export const DEFAULT_PROJECT_ID = PROJECT_ID

export function getApprovalsUrl(): string {
  let raw = (process.env.ADMIN_PORTAL_URL || "").trim()
  if (!raw) return "/admin/login"
  if (!/^https?:\/\//i.test(raw) && !raw.startsWith("/") && /^[a-z0-9.-]+\.[a-z]{2,}/i.test(raw)) {
    raw = `https://${raw}`
  }
  return raw
    .replace(/\/admin\/login.*$/i, "")
    .replace(/\?.*$/, "")
    .replace(/\/+$/, "") || "/admin/login"
}
