/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // SEO optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Generate static pages for better SEO
  output: 'standalone',
  // Astro Hybrid owns `/` — legacy `/login` permanently redirects home.
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/",
        permanent: true,
      },
      {
        source: "/login/:path*",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
