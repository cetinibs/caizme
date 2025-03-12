"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  // Sadece istemci tarafında çalıştığından emin ol
  useEffect(() => {
    setMounted(true);
    
    // localStorage'dan tema tercihini al
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    
    // Eğer localStorage'da tema varsa, onu kullan
    if (storedTheme) {
      setTheme(storedTheme);
    } 
    // Yoksa, kullanıcının sistem tercihini kontrol et
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    // Component mount edilmeden önce tema değişikliği yapma
    if (!mounted) return;
    
    // Tema değiştiğinde HTML'e dark class'ını ekle veya kaldır
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Tema tercihini localStorage'a kaydet
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  // Hidrasyon uyumsuzluğunu önlemek için
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
