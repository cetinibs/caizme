"use client";

import { useEffect, useState } from "react";
import { incrementVisitorCount } from "@/services/supabase";

/**
 * Ziyaretçi sayacı bileşeni
 * Sayfa yüklendiğinde ziyaretçi sayısını artırır
 */
const VisitorCounter = () => {
  const [updateAttempted, setUpdateAttempted] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde ziyaretçi sayısını artır
    const updateVisitorCount = async () => {
      try {
        console.log('Ziyaretçi sayısı artırma işlemi başlatılıyor...');
        // localStorage'daki ziyaretçi sayısı bilgisini temizle
        localStorage.removeItem('visitorCounted');
        localStorage.removeItem('lastCountTime');

        // Ziyaretçi sayısını artır
        const result = await incrementVisitorCount();
        console.log('Ziyaretçi sayısı artırma sonucu:', result);

        // İşlem sonucunu kaydet
        setUpdateAttempted(true);

        // Başarısız olduysa tekrar dene
        if (!result) {
          console.log('Ziyaretçi sayısı artırma başarısız oldu, tekrar deneniyor...');
          // 5 saniye sonra tekrar dene
          setTimeout(updateVisitorCount, 5000);
        }
      } catch (error) {
        console.error("Ziyaretçi sayısı artırılırken hata:", error);
        // Hata durumunda tekrar dene
        if (!updateAttempted) {
          console.log('Hata nedeniyle tekrar deneniyor...');
          // 5 saniye sonra tekrar dene
          setTimeout(updateVisitorCount, 5000);
        }
      }
    };

    // Sayfa yüklendikten sonra ziyaretçi sayısını artır
    // setTimeout kullanarak sayfa yüklenmesini bekle
    const timer = setTimeout(() => {
      updateVisitorCount();
    }, 2000);

    return () => clearTimeout(timer);
  }, [updateAttempted]);

  // Görünmez bileşen, sadece ziyaretçi sayısını artırır
  return null;
};

export default VisitorCounter;
