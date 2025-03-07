"use client";

import { useEffect } from "react";
import { incrementVisitorCount } from "@/services/supabase";

/**
 * Ziyaretçi sayacı bileşeni
 * Sayfa yüklendiğinde ziyaretçi sayısını artırır
 */
const VisitorCounter = () => {
  useEffect(() => {
    // Sayfa yüklendiğinde ziyaretçi sayısını artır
    const updateVisitorCount = async () => {
      try {
        await incrementVisitorCount();
      } catch (error) {
        console.error("Ziyaretçi sayısı artırılırken hata:", error);
      }
    };

    // Sayfa yüklendikten sonra ziyaretçi sayısını artır
    // setTimeout kullanarak sayfa yüklenmesini bekle
    const timer = setTimeout(() => {
      updateVisitorCount();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Görünmez bileşen, sadece ziyaretçi sayısını artırır
  return null;
};

export default VisitorCounter;
