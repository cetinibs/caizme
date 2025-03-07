"use client";

import { ReactNode } from 'react';
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/organisms/Navbar";
import { AuthProvider } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Create a client
const queryClient = new QueryClient();

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          <Toaster position="top-right" />
          
          {children}
          
          <footer className="bg-white dark:bg-gray-900 mt-12 py-6 border-t dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-600 dark:text-gray-400 text-sm"> 2025 Caiz mi? Tüm hakları saklıdır.</p>
                </div>
                <div className="flex space-x-4">
                  <a href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500">İletişim</a>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500">Gizlilik Politikası</a>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500">Kullanım Koşulları</a>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
