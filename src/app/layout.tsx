import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import VisitorCounter from '@/components/atoms/VisitorCounter';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Caiz.me - İslami Sorularınızın Cevabı',
  description: 'İslami sorularınızı sorun, hızlı ve güvenilir cevaplar alın.',
  keywords: 'islam, dini sorular, fetva, caiz mi, haram mı, sünnet, fıkıh, akaid',
  authors: [{ name: 'Caiz.me Ekibi' }],
  creator: 'Caiz.me',
  publisher: 'Caiz.me',
  verification: {
    google: 'wMJgbeJzlF5_t5K5s5t8RzmqGt4oRXHMjgNwXa3QX8A',
  },
  openGraph: {
    title: 'Caiz.me - İslami Sorularınızın Cevabı',
    description: 'İslami sorularınızı sorun, hızlı ve güvenilir cevaplar alın.',
    url: 'https://caiz.me',
    siteName: 'Caiz.me',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <AuthProvider>
              <VisitorCounter />
              {children}
              <Toaster position="bottom-right" />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
