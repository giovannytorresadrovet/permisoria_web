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
  },
  // Ensure static assets are properly served
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Increase static generation timeout
  staticPageGenerationTimeout: 180,
};

module.exports = nextConfig; 