"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { supabase } from "@/services/supabase";
import { User } from "@supabase/supabase-js";

// Auth context tipi
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
};

// Varsayılan context değeri
const defaultContext: AuthContextType = {
  user: null,
  isLoading: true,
  signIn: async () => ({ error: new Error("AuthProvider yüklenmedi") }),
  signInWithGoogle: async () => ({ error: new Error("AuthProvider yüklenmedi") }),
  signUp: async () => ({ error: new Error("AuthProvider yüklenmedi") }),
  signOut: async () => ({ error: new Error("AuthProvider yüklenmedi") }),
};

// Auth context oluşturma
export const AuthContext = createContext<AuthContextType>(defaultContext);

// Auth Provider bileşeni
export function AuthProvider({ children }: { children: ReactNode }) {
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

  const auth = {
    user,
    isLoading,
    signIn: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      } catch (error) {
        console.error("Giriş yapılırken hata:", error);
        return { error };
      }
    },
    signInWithGoogle: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        return { error };
      } catch (error) {
        console.error("Google ile giriş yapılırken hata:", error);
        return { error };
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        return { error };
      } catch (error) {
        console.error("Kayıt olunurken hata:", error);
        return { error };
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        return { error };
      } catch (error) {
        console.error("Çıkış yapılırken hata:", error);
        return { error };
      }
    },
  };

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook'u
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
