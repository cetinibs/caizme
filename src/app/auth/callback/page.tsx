"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabase';
import { Suspense } from 'react';

function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash
        const hash = window.location.hash;
        
        // If there's a hash, it means we have an access token
        if (hash) {
          // The supabase client will automatically handle the token exchange
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
            router.push('/giris?error=auth');
            return;
          }
          
          if (data.session) {
            // Redirect to home page on successful authentication
            router.push('/');
          } else {
            // If no session, redirect to login page
            router.push('/giris');
          }
        } else {
          // If no hash, redirect to login page
          router.push('/giris');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        router.push('/giris?error=unknown');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Giriş Yapılıyor...</h1>
        <p className="text-gray-600">Lütfen bekleyin, yönlendiriliyorsunuz.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Yükleniyor...</h1>
          <p className="text-gray-600">Lütfen bekleyin.</p>
        </div>
      </div>
    }>
      <AuthCallback />
    </Suspense>
  );
}