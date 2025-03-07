/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Derleme sırasında ESLint kontrolünü devre dışı bırak
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Derleme sırasında TypeScript kontrolünü devre dışı bırak
    ignoreBuildErrors: true,
  },
  
  images: {
    domains: ['images.unsplash.com'],
  },
};

module.exports = nextConfig;
