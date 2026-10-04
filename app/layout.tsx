import { cookies, headers } from "next/headers"
import type { Metadata } from "next"
import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import ProtectedLayout from "@/components/protected-layout"
import CrawlerSeoPage from "@/components/CrawlerSeoPage"
import { MaintenanceScreen } from "@/components/maintenance-screen"
import { isCrawlerSeoPageUA } from "@/lib/bot-detection"
import { isCrawlerSeoPreviewUnlocked } from "@/lib/crawler-seo-preview"
import { MAINTENANCE_MODE } from "@/lib/maintenance"
import { isSeoCrawlerPath } from "@/lib/seo-crawler-paths"
import { SeoJsonLd } from "@/components/seo-json-ld"
import { CrawlerSeoHead } from "@/components/CrawlerSeoHead"
import { INDEXABLE_PAGE_ROBOTS } from "@/lib/seo-robots-metadata"
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_TITLE } from "@/lib/seo-metadata"
import {
  SITE_DISPLAY_NAME,
  SITE_HOMEPAGE_CANONICAL,
  SITE_ORIGIN,
} from "@/lib/site-url"
import "./globals.css"

const SOCIAL_PREVIEW_IMAGE = "/og-image.png"
const OG_IMAGE_URL = new URL(SOCIAL_PREVIEW_IMAGE, SITE_HOMEPAGE_CANONICAL).href

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_DISPLAY_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_DISPLAY_NAME,
  authors: [{ name: SITE_DISPLAY_NAME }],
  creator: SITE_DISPLAY_NAME,
  publisher: SITE_DISPLAY_NAME,
  robots: INDEXABLE_PAGE_ROBOTS,
  alternates: {
    canonical: SITE_HOMEPAGE_CANONICAL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  other: {
    "msapplication-TileImage": "/icon-48x48.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_HOMEPAGE_CANONICAL,
    siteName: SITE_DISPLAY_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: `${SITE_DISPLAY_NAME} sign-in`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
}

export const dynamic = "force-dynamic"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const cookieStore = await cookies()
  const pathname = headersList.get("x-pathname") || "/"
  const ua =
    headersList.get("user-agent") ||
    headersList.get("x-original-user-agent") ||
    headersList.get("x-forwarded-user-agent") ||
    ""
  // Header/cookie from middleware, or UA+path fallback if custom headers were stripped (GSC bug).
  const isCrawlerSeo =
    isCrawlerSeoPreviewUnlocked() ||
    headersList.get("x-crawler-seo-page") === "1" ||
    cookieStore.get("x-crawler-seo-page")?.value === "1" ||
    (isCrawlerSeoPageUA(ua) && isSeoCrawlerPath(pathname))

  if (isCrawlerSeo) {
    return (
      <html lang="en">
        <body className="font-sans antialiased">
          <CrawlerSeoHead />
          <SeoJsonLd />
          <CrawlerSeoPage />
        </body>
      </html>
    )
  }

  if (MAINTENANCE_MODE) {
    return (
      <html lang="en">
        <body className="font-sans antialiased">
          <SeoJsonLd />
          <MaintenanceScreen />
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SeoJsonLd />
        <ProtectedLayout>{children}</ProtectedLayout>
        <Analytics />
      </body>
    </html>
  )
}
