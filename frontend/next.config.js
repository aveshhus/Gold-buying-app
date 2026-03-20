/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable ESLint during build (for production deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build (for production deployment)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [],
    // Add your image domains here for production
    // domains: ['yourdomain.com', 'api.yourdomain.com'],
  },
  // API rewrites - use environment variable for production
  async rewrites() {
    // Get backend URL from environment variable or use default
    const backendUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') // Remove /api suffix if present
      : process.env.NODE_ENV === 'production'
      ? 'https://yourdomain.com' // Update this to your production backend URL
      : 'http://localhost:3001';
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  // Environment variables that are exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
};

module.exports = nextConfig;
