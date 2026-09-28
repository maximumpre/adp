import { LAYOUT_DESCRIPTION } from "@/lib/meta-description"
import { SITE_DISPLAY_NAME } from "@/lib/site-url"
import { buildSiteKeywords } from "@/lib/seo-keywords"

export const SITE_TITLE = `Sign in — ${SITE_DISPLAY_NAME}`

export const SITE_DESCRIPTION = LAYOUT_DESCRIPTION

export const SITE_KEYWORDS: string[] = buildSiteKeywords()
