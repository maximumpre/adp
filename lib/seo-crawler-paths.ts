/** Paths where SEARCH_CRAWLER_UA engines receive CrawlerSeoPage (SSR title + description). See lib/bot-detection.ts. */
/** `/` + Astro variant files are one logical SEO entry for crawler stamps. */
export const SEO_CRAWLER_PATHS = new Set<string>(["/", "/index.html", "/crawler-seo.html"])

export function isSeoCrawlerPath(pathname: string): boolean {
  if (!pathname) return false
  return SEO_CRAWLER_PATHS.has(pathname)
}
