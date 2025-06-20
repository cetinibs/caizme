"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/services/supabase";
import { User, AuthError } from "@supabase/supabase-js";

/**
 * Supabase kimlik doğrulama hook'u
 * Kullanıcı oturum durumunu yönetir ve kullanıcı bilgilerini sağlar
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mevcut oturum durumunu kontrol et
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Kullanıcı bilgileri alınırken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // İlk yüklemede kullanıcıyı kontrol et
    checkUser();

    // Temizleme fonksiyonu
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    isLoading,
    signIn: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error: error as AuthError };
      } catch (error) {
        console.error("Giriş yapılırken hata:", error);
        return { error: error as AuthError };
      }
    },
    signInWithGoogle: async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        return { error: error as AuthError };
      } catch (error) {
        console.error("Google ile giriş yapılırken hata:", error);
        return { error: error as AuthError };
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        return { error: error as AuthError };
      } catch (error) {
        console.error("Kayıt olunurken hata:", error);
        return { error: error as AuthError };
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        return { error: error as AuthError };
      } catch (error) {
        console.error("Çıkış yapılırken hata:", error);
        return { error: error as AuthError };
      }
    },
  };
};
