"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiMessageSquare, FiHeart } from "react-icons/fi";
import { getStatistics } from "@/services/supabase";
import { motion } from "framer-motion";

interface Statistics {
  totalQuestions: number;
  totalVisitors: number;
  totalLikes: number;
}

const StatisticsBar = () => {
  const [stats, setStats] = useState<Statistics>({
    totalQuestions: 0,
    totalVisitors: 0,
    totalLikes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async (forceRefresh = false) => {
      try {
        setIsLoading(true);
        console.log('İstatistikler yükleniyor... (Zorla yenileme:', forceRefresh, ')');

        // Önbelleği temizle (zorla yenileme durumunda)
        if (forceRefresh) {
          localStorage.removeItem('cachedStats');
          localStorage.removeItem('cachedStatsTime');
          console.log('Önbellek temizlendi, güncel veriler alınacak');
        }

        // Veritabanından güncel istatistikleri al
        const statistics = await getStatistics();
        console.log('Veritabanından alınan istatistikler:', statistics);

        // Sıfır değerler varsa ve zorla yenileme değilse, tekrar dene
        if (!forceRefresh && (statistics.totalQuestions === 0 || statistics.totalVisitors === 0)) {
          console.log('Sıfır değerler algılandı, zorla yenileme yapılıyor...');
          // Kısa bir bekleme süresi sonra zorla yenileme yap
          setTimeout(() => fetchStatistics(true), 500);
          return;
        }

        setStats(statistics);
      } catch (error) {
        console.error("İstatistikler yüklenirken hata oluştu:", error);

        // Hata durumunda önbellekteki verileri kontrol et
        try {
          const cachedStatsStr = localStorage.getItem('cachedStats');
          if (cachedStatsStr) {
            const cachedStats = JSON.parse(cachedStatsStr);
            console.log('Hata durumunda önbellekten istatistikler kullanılıyor:', cachedStats);
            setStats(cachedStats);
          } else {
            // Önbellekte de yoksa varsayılan değerleri göster
            setStats({
              totalQuestions: 0,
              totalVisitors: 0,
              totalLikes: 0,
            });

            // Varsayılan değerler gösteriliyorsa ve zorla yenileme değilse, tekrar dene
            if (!forceRefresh) {
              console.log('Varsayılan değerler gösteriliyor, zorla yenileme yapılıyor...');
              // Kısa bir bekleme süresi sonra zorla yenileme yap
              setTimeout(() => fetchStatistics(true), 1000);
            }
          }
        } catch (e) {
          console.error('Önbellek okuma hatası:', e);
          // Varsayılan değerleri göster
          setStats({
            totalQuestions: 0,
            totalVisitors: 0,
            totalLikes: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    // İlk yükleme - zorla yenileme ile
    fetchStatistics(true);

    // 15 saniyede bir istatistikleri güncelle
    const intervalId = setInterval(() => fetchStatistics(true), 15000);

    // Temizleme fonksiyonu
    return () => clearInterval(intervalId);
  }, []);

  // İstatistik kartı bileşeni
  const StatCard = ({
    icon,
    title,
    value,
    delay
  }: {
    icon: React.ReactNode;
    title: string;
    value: number;
    delay: number;
  }) => (
    <motion.div
      className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center space-x-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {isLoading ? (
            <span className="inline-block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
          ) : (
            value.toLocaleString()
          )}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        icon={<FiMessageSquare className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        title="Toplam Soru"
        value={stats.totalQuestions}
        delay={0}
      />
      <StatCard
        icon={<FiUsers className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        title="Toplam Ziyaretçi"
        value={stats.totalVisitors}
        delay={0.1}
      />
      <StatCard
        icon={<FiHeart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
        title="Toplam Beğeni"
        value={stats.totalLikes}
        delay={0.2}
      />
    </div>
  );
};

export default StatisticsBar;
