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

  // Vercel ortamında çalışırken, NEXT_PUBLIC_ olmayan env değişkenlerini
  // istemci tarafında da kullanılabilir hale getir
  env: {
    // OpenRouter API anahtarını hem sunucu hem istemci tarafında kullanılabilir yap
    // Bu, Vercel'de OPENROUTER_API_KEY değişkenini ayarlamanız gerektiği anlamına gelir
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  },
  
  // Next.js 15+ için uyumlu experimental özellikler
  experimental: {
    // Sayfalar için uyumluluk modunu etkinleştir
    ppr: false,
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

module.exports = nextConfig;
