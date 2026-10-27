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

/**
 * Step 5 — search-demand harvest (SERP-observed queries not covered above).
 * ADDITIVE ONLY: never remove entries from this or any earlier array.
 */
export const SEARCH_DEMAND_EXPANDED_KEYWORDS = [
  // Product login cluster (each has a dedicated ADP login page / SERP presence)
  "ADP iPayStatements login",
  "ADP Vantage HCM login",
  "RUN Powered by ADP login",
  "My TotalSource login",
  "ADP Accountant Connect login",
  "ezLaborManager login",
  // Host / URL-navigational cluster (rank as URL-typed queries)
  "login.adp.com",
  "signin.online.adp.com",
  "workforcenow.adp.com",
  "w2.adp.com",
  // Task / problem-solving cluster
  "ADP pay stub login",
  "download ADP pay statement",
  "ADP W-4 online",
  "ADP reset password",
  "ADP forgot user ID",
  "ADP locked out of account",
  "ADP login help",
  // Benefits / time / mobile cluster
  "myWisely login",
  "ADP open enrollment login",
  "ADP 1095-C",
  "ADP time clock login",
  "ADP mobile app",
  "ADP employee service center",
] as const

/**
 * Step 5 full rerun 2026-10-27 — live suggest harvest + company/entity deepen.
 * ADDITIVE ONLY: never remove entries from this or any earlier array.
 */
/**
 * Astro Hybrid conversion 2026-10-27 — append-only twin/landing SEO deepen.
 * ADDITIVE ONLY: never remove entries from this or any earlier array.
 */
export const ASTRO_HYBRID_2026_10_27_KEYWORDS = [
  "ADP Astro landing sign in",
  "MyADP secure employee portal login",
  "ADP employee portal SSR landing",
  "online.adp.com MyADP RDBX sign in",
  "ADP Workforce Now employee self service",
] as const

export const STEP5_RERUN_2026_10_27_KEYWORDS = [
  // Harvest (Google/Bing/DDG suggest — ADP × login/sign-in/portal)
  "ADP login employee",
  "ADP login workforce",
  "ADP login portal",
  "ADP login clock in",
  "ADP login RUN",
  "ADP login Workforce Now",
  "ADP login employee Workforce Now",
  "ADP login employee portal",
  "ADP login support",
  "ADP login 401k",
  "ADP login paystub",
  "ADP login payroll",
  "ADP login employer",
  "ADP login help",
  "ADP login app",
  "ADP sign in employee",
  "ADP sign in portal",
  "ADP sign in workforce",
  "ADP sign in page",
  "ADP sign in not working",
  "ADP sign in employee portal",
  "ADP sign in help",
  "ADP sign in RUN",
  "ADP sign in employer",
  "ADP sign in clock in",
  "ADP sign in payroll",
  "ADP sign in Workforce Now",
  "ADP employee portal login",
  "ADP employee portal app",
  "ADP employee portal sign up",
  "ADP employee portal help",
  // Cluster 1 deepen — corporate / Knowledge Graph
  "Automatic Data Processing",
  "Automatic Data Processing Inc",
  "NYSE ADP",
  "ADP Inc",
  "ADP Roseland",
  "MyADP registration code",
  // Cluster 2 deepen — benefits / tax / retirement
  "ADP 401k login",
  "ADP retirement login",
  "ADP benefits enrollment",
  "ADP dental vision login",
  "ADP Form W-2 online",
  "ADP Form 1099 online",
  "ADP Form 1095-C login",
  // Cluster 3 deepen — auth intents
  "signin.adp.com login",
  "MyADP forgot password",
  "ADP two factor authentication",
  "ADP registration code from employer",
  // Cluster 4 deepen — workforce roles
  "ADP former employee login",
  "ADP retiree pay stub",
  "ADP manager login Workforce Now",
  "ADP dependent benefits access",
  // Cluster 5 deepen — platform synergy
  "ADP Workforce Now portal",
  "ADP TotalSource employee login",
  "ADP RUN Powered by ADP",
  "ADP HCM portal login",
  "ADP ALINE card login",
  // Cluster 6 deepen — self-service / mobile
  "ADP Mobile Solutions login",
  "ADP Mobile Solutions app",
  "ADP Wisely card login",
  "ADP time and attendance login",
  "ADP PTO request login",
  "ADP direct deposit login",
] as const

export function buildSiteKeywords(): string[] {
  return mergeKeywords(
    BRAND_KEYWORDS,
    HOST_KEYWORDS,
    BENEFITS_KEYWORDS,
    PLATFORM_KEYWORDS,
    INTENT_KEYWORDS,
    FINAL_URL_EXPANDED_KEYWORDS,
    SEARCH_DEMAND_EXPANDED_KEYWORDS,
    STEP5_RERUN_2026_10_27_KEYWORDS,
    ASTRO_HYBRID_2026_10_27_KEYWORDS,
  )
}
