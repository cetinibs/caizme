'use client';

import { useEffect, useState } from 'react';
import { getStatistics, incrementVisitorCount } from '@/services/supabase';
import { FaQuestion, FaUsers, FaHeart } from 'react-icons/fa';

interface Statistics {
  totalQuestions: number;
  totalVisitors: number;
  totalLikes: number;
}

export default function StatisticsBar() {
  const [stats, setStats] = useState<Statistics>({
    totalQuestions: 0,
    totalVisitors: 0,
    totalLikes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const statistics = await getStatistics();
        setStats(statistics);
        
        // Ziyaretçi sayısını artır
        await incrementVisitorCount();
      } catch (error) {
        console.error('İstatistikler yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-wrap justify-around items-center">
        <div className="flex items-center space-x-2 p-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <FaQuestion className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Toplam Soru</p>
            <p className="text-xl font-bold text-gray-800">
              {isLoading ? '...' : stats.totalQuestions.toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <div className="bg-green-100 p-2 rounded-full">
            <FaUsers className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ziyaretçi</p>
            <p className="text-xl font-bold text-gray-800">
              {isLoading ? '...' : stats.totalVisitors.toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 p-2">
          <div className="bg-red-100 p-2 rounded-full">
            <FaHeart className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Beğeni</p>
            <p className="text-xl font-bold text-gray-800">
              {isLoading ? '...' : stats.totalLikes.toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
