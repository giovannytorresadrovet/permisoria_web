/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  // Ensure proper asset loading and prevent caching issues for API endpoints
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Configure additional Next.js options as needed
};

module.exports = nextConfig; 