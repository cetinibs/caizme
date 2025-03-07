import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppProviders from "@/providers/AppProviders";
import JsonLd from "./jsonld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Caizme - İslami Sorularınıza Uzman Yanıtlar",
  description: "İslami sorularınızı sorun, yapay zeka destekli detaylı ve güvenilir cevaplar alın. Namaz, oruç, zekat ve diğer dini konularda bilgi edinin.",
  keywords: "caiz mi, islam, dini sorular, namaz, oruç, zekat, fıkıh, fetva, islam hukuku, dini bilgiler, helal, haram",
  authors: [{ name: "Caizme", url: "https://caizme.com" }],
  creator: "Caizme",
  publisher: "Caizme",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  metadataBase: new URL("https://caizme.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Caizme - İslami Sorularınıza Uzman Yanıtlar",
    description: "İslami sorularınızı sorun, yapay zeka destekli detaylı ve güvenilir cevaplar alın. Namaz, oruç, zekat ve diğer dini konularda bilgi edinin.",
    url: "https://caizme.com",
    siteName: "Caizme",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Caizme - İslami Sorularınıza Uzman Yanıtlar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caizme - İslami Sorularınıza Uzman Yanıtlar",
    description: "İslami sorularınızı sorun, yapay zeka destekli detaylı ve güvenilir cevaplar alın.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: "wMJgbeJzlF5_t5K5s5t8RzmqGt4oRXHMjgNwXa3QX8A", // Google Search Console doğrulama kodu
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100`}
      >
        <AppProviders>
          {children}
        </AppProviders>
        <JsonLd />
      </body>
    </html>
  );
}
