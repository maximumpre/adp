/**
 * Resolved image URLs for the Astro pages.
 * Root-relative public/ paths — avoids ImageMetadata `[object Object]` in src.
 */
export const toImageUrl = (asset: string | { src: string }): string =>
  typeof asset === "string" ? asset : encodeURI(asset.src)

export const BRAND_LOGO_SRC = "/adp-login-logo.png"
export const HERO_IMAGE_SRC = "/adp-login-logo.png"
export const PARTNER_LOGO_SRC = "/adp-qr.png"
export const QR_CODE_SRC = "/adp-qr.png"
