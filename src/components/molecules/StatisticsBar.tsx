"use client";

import { useEffect, useState } from 'react';
import { getStatistics, incrementVisitorCount } from '@/services/supabase';
import { FiUsers, FiHelpCircle, FiThumbsUp } from 'react-icons/fi';
import CountUp from 'react-countup';

interface Statistics {
  totalQuestions: number;
  totalVisitors: number;
  totalLikes: number;
}

const StatisticsBar = () => {
  const [stats, setStats] = useState<Statistics>({
    totalQuestions: 0,
    totalVisitors: 0,
    totalLikes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const statistics = await getStatistics();
        setStats(statistics);
        
        // Ziyaretçi sayısını artır
        await incrementVisitorCount();
      } catch (error) {
        console.error('İstatistikler alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const statItems = [
    {
      icon: <FiUsers className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      label: 'Ziyaretçi',
      value: stats.totalVisitors,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: <FiHelpCircle className="h-6 w-6 text-purple-500 dark:text-purple-400" />,
      label: 'Soru',
      value: stats.totalQuestions,
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: <FiThumbsUp className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      label: 'Beğeni',
      value: stats.totalLikes,
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
  ];

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div 
            key={index} 
            className="card p-6 flex items-center transition-transform hover:scale-102 duration-300"
          >
            <div className={`${item.bgColor} p-4 rounded-full mr-4`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  <CountUp end={item.value} duration={2} separator="," />
                )}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsBar;
