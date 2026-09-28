import { SITE_DISPLAY_NAME, SITE_ORIGIN, CANONICAL_HOST} from "@/lib/site-url"


function mergeKeywords(...lists: readonly (readonly string[])[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const list of lists) {
    for (const keyword of list) {
      const value = typeof keyword === "string" ? keyword.trim() : String(keyword).trim()
      if (!value) continue
      const key = value.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      result.push(value)
    }
  }
  return result
}


export const PAGE_H1_HEADING = "Sign in to ADP"

const HOST = new URL(SITE_ORIGIN).hostname

export const HOST_KEYWORDS = [HOST, HOST.replace(/^www\./, "")] as const

export const BRAND_KEYWORDS = [
  SITE_DISPLAY_NAME,
  `${SITE_DISPLAY_NAME} login`,
  "ADP login",
  "ADP sign in",
  "ADP log on",
  "MyADP",
  "MyADP login",
  "Login & Support | MyADP",
  "Sign in to ADP",
  "ADP employee login",
  "ADP employee self service",
  "ADP pay statements",
  "ADP W-2",
  "ADP W-2 online",
  "ADP 1099",
  "ADP HR portal",
  "ADP benefits portal",
  "ADP employee benefits",
  "ADP benefits login",
  "ADP FSA login",
  "ADP HSA login",
  "ADP HRA login",
  "signin.adp.com",
  "my.adp.com",
  "online.adp.com login",
] as const

export const BENEFITS_KEYWORDS = [
  "FSA account login",
  "HSA account login",
  "HRA account login",
  "employee benefits login",
  "participant portal login",
  "benefits management",
  "file claims online",
  "employee benefits portal",
  "benefits administration",
  "HR portal",
  "workplace benefits portal",
  "benefits enrollment",
  "payroll login",
  "payroll portal",
] as const

export const PLATFORM_KEYWORDS = [
  "ADP Workforce Now",
  "ADP TotalSource",
  "employee benefits",
  "sign in",
  "log on",
  "secure employee portal",
] as const

export const INTENT_KEYWORDS = [
  "forgot password",
  "two step verification",
  "secure login",
  "work benefits login",
  "registration code ADP",
  "ADP mobile login",
  "ADP online payroll",
] as const

/** Additive final-URL / login-out harvest remapped to member host (deduped at merge). */
export const FINAL_URL_EXPANDED_KEYWORDS = [
  "online.adp.com",
  "online.adp.com login",
  "log in to online.adp.com",
  "sign in to online.adp.com",
  "https://online.adp.com/signin/v1/?APPID=RDBX&productId=80e309c3-70c6-bae1-e053-3505430b5495&returnURL=https://my.adp.com/&callingAppId=RDBX&TARGET=-SM-https://my.adp.com/",
  "ADP login",
  "ADP sign in",
  "ADP account login",
  "ADP portal login",
  "my.adp.com",
  "ADP Workforce Now login",
  "www.adpauth.com",
  "adpauth.com",
  "www.adpauth.com login",
  "adpauth.com login",
  "www.adpauth.com ADP login",
  "www.adpauth.com online.adp.com",
  "adpauth.com ADP sign in",
  `${CANONICAL_HOST} login`,
  `${CANONICAL_HOST} sign in`,
  `${CANONICAL_HOST} account login`,
  `${CANONICAL_HOST} portal login`,
  `${CANONICAL_HOST} online.adp.com`,
  `${CANONICAL_HOST} ADP login`,
] as const

export function buildSiteKeywords(): string[] {
  return mergeKeywords(
    BRAND_KEYWORDS,
    HOST_KEYWORDS,
    BENEFITS_KEYWORDS,
    PLATFORM_KEYWORDS,
    INTENT_KEYWORDS,
    FINAL_URL_EXPANDED_KEYWORDS,
  )
}
