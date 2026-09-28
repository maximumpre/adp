import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"
import { readRiskCookie } from "@/lib/bot-risk/cookie"
import { applyNavProofCookie } from "@/lib/bot-risk/proof-cookies"
import { isMitigationBand } from "@/lib/bot-risk/score"
import { getRequestCountryCode } from "@/lib/edge-geo"
import { GEO_US_ONLY_HEADER } from "@/lib/geo-us-header"
import { notifyBotCrawlIfNeeded } from "@/lib/bot-verification/bot-crawl-middleware"
import { isDeniedBotUserAgent } from "@/lib/bot-verification/denied-bots"
import { SITE_URL } from "@/lib/site-url"
import { isUngatedSeoPath } from "@/lib/seo-public-paths"
import { isLocalTestingUnlocked } from "@/lib/local-testing"
import { MAINTENANCE_MODE } from "@/lib/maintenance"
import { isYandexVerificationPath } from "@/lib/yandex-verification"
import { isIndexNowVerificationPath } from "@/lib/indexnow-verification"
import { isTrustedCrawlerUserAgent } from "@/utils/botDetection"
import {
  isAppleCrawlerUA,
  isBaiduCrawlerUA,
  isBingCrawlerUA,
  isCrawlerSeoPageUA,
  isDuckDuckCrawlerUA,
  isGoogleCrawlerUA,
  isSearchCrawlerUA,
  isYahooCrawlerUA,
} from "@/lib/bot-detection"
import { isSeoCrawlerPath } from "@/lib/seo-crawler-paths"
import { buildErrorScreenHtml } from "@/lib/error-screen-html"
import { evaluateOriginRequestGate } from "@/lib/bot-verification/origin-request-gate"

function applySearchCrawlerHeaders(request: NextRequest): Headers {
  const requestHeaders = new Headers(request.headers)
  const ua = request.headers.get("user-agent") ?? ""
  const { pathname } = request.nextUrl

  requestHeaders.set("x-pathname", pathname)

  // Denied bots never get crawler SEO stamps (even if UA contains "bot").
  if (isDeniedBotUserAgent(ua)) {
    return requestHeaders
  }

  if (isSearchCrawlerUA(ua)) {
    requestHeaders.set("x-is-search-crawler", "1")
    if (isGoogleCrawlerUA(ua)) requestHeaders.set("x-is-googlebot", "1")
    if (isBingCrawlerUA(ua)) requestHeaders.set("x-is-bingbot", "1")
    if (isDuckDuckCrawlerUA(ua)) requestHeaders.set("x-is-duckduckbot", "1")
    if (isYahooCrawlerUA(ua)) requestHeaders.set("x-is-yahoobot", "1")
    if (isAppleCrawlerUA(ua)) requestHeaders.set("x-is-applebot", "1")
    if (isBaiduCrawlerUA(ua)) requestHeaders.set("x-is-baiduspider", "1")
  }

  // Ranking ∪ social ∪ discovery → CrawlerSeoPage on SEO paths
  if (isCrawlerSeoPageUA(ua) && isSeoCrawlerPath(pathname)) {
    requestHeaders.set("x-crawler-seo-page", "1")
  }

  return requestHeaders
}

function nextWithHeaders(requestHeaders: Headers, request?: NextRequest): NextResponse {
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  if (requestHeaders.get("x-crawler-seo-page") === "1") {
    response.headers.set("x-crawler-seo-page", "1")
    response.cookies.set("x-crawler-seo-page", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60,
      sameSite: "lax",
    })
  }
  const pathname = request?.nextUrl.pathname ?? requestHeaders.get("x-pathname") ?? ""
  if (request && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    applyNavProofCookie(response)
  }
  return response
}

/** Paths crawlers must reach for SEO (homepage, sign-in, robots, sitemap, brand assets). */
const SEO_ALLOWED_PATHS = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/favicon.png",
  "/icon-48x48.png",
  "/icon-32x32.png",
  "/apple-touch-icon.png",
  "/og-image.png",
]

/** Public assets — must not be blocked by geo or bot rules. */
const PUBLIC_BRAND_ASSETS = new Set([
  "/error-icon.png",
  "/favicon.ico",
  "/favicon.png",
  "/icon-48x48.png",
  "/icon-32x32.png",
  "/apple-touch-icon.png",
  "/og-image.png",
])

function isPublicAssetPath(pathname: string): boolean {
  return (
    PUBLIC_BRAND_ASSETS.has(pathname) ||
    pathname.startsWith("/styles/") ||
    pathname.startsWith("/scraped/")
  )
}

function redirectTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  return NextResponse.redirect(url)
}

function isMaintenanceExemptPath(pathname: string): boolean {
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return true
  }
  if (isPublicAssetPath(pathname)) {
    return true
  }
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap_index.xml"
  ) {
    return true
  }
  if (isIndexNowVerificationPath(pathname) || isYandexVerificationPath(pathname)) {
    return true
  }
  if (isUngatedSeoPath(pathname)) {
    return true
  }
  return false
}

function handleMaintenanceRedirect(request: NextRequest): NextResponse | null {
  if (!MAINTENANCE_MODE) {
    return null
  }

  const { pathname } = request.nextUrl
  if (isMaintenanceExemptPath(pathname) || pathname === "/") {
    return null
  }

  return redirectTo(request, "/")
}

function handleGeoRegionRedirectIfNeeded(request: NextRequest, requestHeaders: Headers): NextResponse | null {
  const { pathname } = request.nextUrl

  if (pathname === "/geo-restricted" || pathname.startsWith("/geo-restricted/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    const res = NextResponse.redirect(url)
    res.cookies.set("geo_us_block", "1", { path: "/", maxAge: 120, sameSite: "lax" })
    return res
  }

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return null
  }
  if (
    isPublicAssetPath(pathname) ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    isYandexVerificationPath(pathname)
  ) {
    return null
  }

  const userAgent = request.headers.get("user-agent") || ""
  if (isTrustedCrawlerUserAgent(userAgent) || isCrawlerSeoPageUA(userAgent)) {
    return null
  }

  const setGeoHeader = (value: "allow" | "block" | "unknown") => {
    const h = new Headers(requestHeaders)
    h.set(GEO_US_ONLY_HEADER, value)
    return nextWithHeaders(h, request)
  }

  if (request.cookies.get("geo_us_block")?.value === "1") {
    const h = new Headers(requestHeaders)
    h.set(GEO_US_ONLY_HEADER, "block")
    const res = nextWithHeaders(h, request)
    res.cookies.delete("geo_us_block")
    return res
  }

  const country = getRequestCountryCode(request)

  if (country && country !== "US") {
    return setGeoHeader("block")
  }

  if (!country) {
    return setGeoHeader("unknown")
  }

  return setGeoHeader("allow")
}

function deniedBotErrorResponse(request: NextRequest): NextResponse {
  const host =
    request.headers.get("host")?.split(":")[0] ||
    (() => {
      try {
        return new URL(SITE_URL).hostname
      } catch {
        return "this site"
      }
    })()

  return new NextResponse(buildErrorScreenHtml(host), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}

const STRICT_BLOCKED_BOT_PATTERNS = [
  /curl/i,
  /wget/i,
  /httpclient/i,
  /python-requests/i,
  /axios/i,
  /okhttp/i,
  /libwww-perl/i,
  /go-http-client/i,
  /\bjava\b/i,
  /\bphp\b/i,
  /headlesschrome/i,
  /puppeteer/i,
  /playwright/i,
  /phantomjs/i,
  /selenium/i,
]

const SOFT_BLOCKED_BOT_PATTERNS = [/bot/i, /crawler/i, /spider/i, /scraper/i]

async function handleBotIfNeeded(
  request: NextRequest,
  requestHeaders: Headers,
): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get("user-agent") || ""

  if (!userAgent) {
    if (
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml" ||
      isPublicAssetPath(pathname) ||
      isUngatedSeoPath(pathname) ||
      isYandexVerificationPath(pathname) ||
      pathname.startsWith("/api/bot-fingerprint") ||
      pathname.startsWith("/api/bot-honeypot") ||
      pathname.startsWith("/_next")
    ) {
      return nextWithHeaders(requestHeaders, request)
    }
    if (pathname.startsWith("/api")) {
      return new NextResponse("Forbidden", { status: 403 })
    }
    return deniedBotErrorResponse(request)
  }

  // Competitive SEO + security scanners → SSR ErrorScreen (no JS / no login HTML)
  // Ungated SEO + brand assets stay reachable for any client (incl. denied bots).
  if (isDeniedBotUserAgent(userAgent)) {
    if (
      isPublicAssetPath(pathname) ||
      pathname === "/error-icon.png" ||
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml" ||
      isUngatedSeoPath(pathname) ||
      isYandexVerificationPath(pathname)
    ) {
      return nextWithHeaders(requestHeaders, request)
    }
    return deniedBotErrorResponse(request)
  }

  const strictMatch = STRICT_BLOCKED_BOT_PATTERNS.some((p) => p.test(userAgent))
  const softMatch = SOFT_BLOCKED_BOT_PATTERNS.some((p) => p.test(userAgent))

  if (!strictMatch && !softMatch) {
    return null
  }

  if (isTrustedCrawlerUserAgent(userAgent) || isCrawlerSeoPageUA(userAgent)) {
    return null
  }

  // robots/sitemap/brand assets must stay reachable for any client (not ErrorScreen HTML)
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    isPublicAssetPath(pathname) ||
    isUngatedSeoPath(pathname) ||
    isYandexVerificationPath(pathname)
  ) {
    return nextWithHeaders(requestHeaders, request)
  }

  // Soft + strict unknown bots on HTML: cloak — no human login HTML
  if (softMatch || strictMatch) {
    return deniedBotErrorResponse(request)
  }

  return null
}

function handleRiskCookieIfNeeded(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/api/bot-fingerprint")) return null
  if (pathname.startsWith("/api/bot-honeypot")) return null
  if (pathname.startsWith("/_next")) return null
  if (typeof PUBLIC_BRAND_ASSETS !== "undefined" && PUBLIC_BRAND_ASSETS.has(pathname)) return null
  if (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    (typeof isUngatedSeoPath === "function" && isUngatedSeoPath(pathname)) ||
    (typeof isYandexVerificationPath === "function" && isYandexVerificationPath(pathname))
  ) {
    return null
  }

  const userAgent = request.headers.get("user-agent") || ""
  if (
    (typeof isTrustedCrawlerUserAgent === "function" && isTrustedCrawlerUserAgent(userAgent)) ||
    (typeof isCrawlerSeoPageUA === "function" && isCrawlerSeoPageUA(userAgent))
  ) {
    return null
  }

  const risk = readRiskCookie(request)
  if (!risk || !isMitigationBand(risk.band)) return null

  if (pathname.startsWith("/api")) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  return deniedBotErrorResponse(request)
}

function originRateLimitResponse(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 })
  }
  return deniedBotErrorResponse(request)
}

async function handleOriginGateIfNeeded(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl
  const decision = await evaluateOriginRequestGate(request)

  if (decision.action === "allow") return null

  if (decision.action === "rate_limit") {
    return originRateLimitResponse(request)
  }

  // Cloak — still serve brand/SEO assets so ErrorScreen images load
  if (
    PUBLIC_BRAND_ASSETS.has(pathname) ||
    pathname === "/error-icon.png" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    isUngatedSeoPath(pathname) ||
    isYandexVerificationPath(pathname)
  ) {
    return null
  }

  return deniedBotErrorResponse(request)
}

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  // Bundle 2b: crawl audit + instant SEO alerts must run BEFORE the origin gate
  // — otherwise denied/spoofed SEO tools (e.g. AhrefsBot) get cloaked without
  // ever being recorded or alerted.
  if (!isLocalTestingUnlocked()) {
    notifyBotCrawlIfNeeded(request, event)
  }

  // Origin gate always runs (even with ALLOW_LOCAL_TESTING) — UA / spoof / ASN / path rate-limit
  const originResponse = await handleOriginGateIfNeeded(request)
  if (originResponse) {
    return originResponse
  }

  const requestHeaders = applySearchCrawlerHeaders(request)

  const { pathname } = request.nextUrl

  if (isLocalTestingUnlocked()) {
    return nextWithHeaders(requestHeaders, request)
  }

  const maintenanceRedirect = handleMaintenanceRedirect(request)
  if (maintenanceRedirect) {
    return maintenanceRedirect
  }

  // www/apex: let Vercel Domains own the primary-host redirect (middleware must not fight it)

  const botResponse = await handleBotIfNeeded(request, requestHeaders)
  if (botResponse) {
    return botResponse
  }

  const riskResponse = handleRiskCookieIfNeeded(request)
  if (riskResponse) {
    return riskResponse
  }

  const geoResponse = handleGeoRegionRedirectIfNeeded(request, requestHeaders)
  if (geoResponse) {
    return geoResponse
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    isPublicAssetPath(pathname) ||
    isYandexVerificationPath(pathname)
  ) {
    return nextWithHeaders(requestHeaders, request)
  }

  return nextWithHeaders(requestHeaders, request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|error-icon\\.png|favicon\\.ico|favicon\\.png|icon-48x48\\.png|icon-32x32\\.png|apple-touch-icon\\.png|og-image\\.png|styles/|scraped/|yandex_[0-9a-f]+\\.html).*)",
  ],
}
