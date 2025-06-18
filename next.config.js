/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },

  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  },
};

module.exports = nextConfig;
