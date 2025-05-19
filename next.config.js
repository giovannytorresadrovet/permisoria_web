/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  // Completely disable experimental features that might cause issues
  experimental: {},
  // Transpile keep-react to ensure compatibility
  transpilePackages: ['keep-react'],
  // Configure webpack to handle CSS properly
  webpack: (config) => {
    return config;
  }
};

module.exports = nextConfig; 