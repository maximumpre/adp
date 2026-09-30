import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo-metadata"
import {
  SITE_DISPLAY_NAME,
  SITE_HOMEPAGE_CANONICAL,
  SITE_ORIGIN,
  ogImageAbsoluteUrl,
} from "@/lib/site-url"

// SEO_SITE_NAMES.md: brand/search aliases first — the bare lowercase host
// goes LAST as Google's documented fallback when it cannot map the brand.
const SCHEMA_ALTERNATE_NAMES = [
  `${SITE_DISPLAY_NAME} login`,
  "MyADP",
  "MyADP login",
  "Login & Support | MyADP",
  "Sign in to ADP",
  "ADP benefits login",
  "ADP employee login",
] as const

/**
 * JSON-LD structured data for SEO (WebSite + Organization).
 * Rendered in root layout for search engines.
 */
export function SeoJsonLd() {
  const logoUrl = ogImageAbsoluteUrl()

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_DISPLAY_NAME,
    alternateName: [...SCHEMA_ALTERNATE_NAMES, new URL(SITE_ORIGIN).hostname.toLowerCase()],
    description: SITE_DESCRIPTION,
    url: SITE_HOMEPAGE_CANONICAL,
    publisher: {
      "@type": "Organization",
      name: SITE_DISPLAY_NAME,
      url: SITE_ORIGIN,
      logo: logoUrl,
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "LoginAction",
      target: {
        "@type": "EntryPoint",
        url: SITE_HOMEPAGE_CANONICAL,
      },
      name: SITE_TITLE,
    },
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_DISPLAY_NAME,
    url: SITE_ORIGIN,
    logo: logoUrl,
    description: SITE_DESCRIPTION,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: SITE_DISPLAY_NAME,
        item: SITE_HOMEPAGE_CANONICAL,
      },
    ],
  }

  const combined = [websiteSchema, organizationSchema, breadcrumbSchema]

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(combined) }}
    />
  )
}
