/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Tip hatalarını derleme sırasında yoksay
    ignoreBuildErrors: true,
  },
  // Vercel dağıtımı için optimizasyon
  swcMinify: true,
}

module.exports = nextConfig
