import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.adp.com'),
  title: {
    default: "ADP - Login to Your Benefits Account",
    template: "%s | ADP"
  },
  description: "Login to your ADP benefits account. Access your balance, file claims, manage your benefits, and explore FSA, HSA, and HRA plans. Secure participant and employer portal access.",
  keywords: [
    "ADP",
    "ADP benefits",
    "benefits login",
    "FSA login",
    "HSA login",
    "HRA login",
    "flexible spending account",
    "health savings account",
    "health reimbursement arrangement",
    "benefits portal",
    "file claims",
    "benefits balance",
    "employee benefits",
    "participant login",
    "employer login"
  ],
  authors: [{ name: "ADP" }],
  creator: "ADP",
  publisher: "ADP",
  generator: 'Next.js',
  applicationName: "ADP",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/adp-logo.png', sizes: 'any' },
    ],
    apple: [
      { url: '/adp-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ADP",
    title: "ADP - Login to Your Benefits Account",
    description: "Login to your ADP benefits account. Access your balance, file claims, and manage your benefits.",
    images: [
      {
        url: "/adp-logo.png",
        width: 1200,
        height: 630,
        alt: "ADP Benefits Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADP - Login to Your Benefits Account",
    description: "Login to your ADP benefits account. Access your balance, file claims, and manage your benefits.",
    images: ["/adp-logo.png"],
    creator: "@ADP",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    
    
    
    
  },
  alternates: {
    canonical: "/",
  },
  category: "Finance",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Flores & Associates",
              "url": "https://www.flores247.com",
              "logo": "https://www.flores247.com/flores.png",
              "description": "Flores & Associates provides comprehensive benefits administration services including FSA, HSA, and HRA plans.",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "url": "https://www.flores247.com/contact-login.vbhtml"
              },
              "sameAs": [
                "https://www.facebook.com/FloresAssociates",
                "https://www.linkedin.com/company/flores-&-associates"
              ]
            })
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Flores247",
              "url": "https://www.flores247.com",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Secure login portal for Flores benefits account management, including FSA, HSA, and HRA plans."
            })
          }}
        />
      </body>
    </html>
  )
}
