'use client';

import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfyeczfulmcxfyvwmxk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZnllY3pmdWxtY3hmeXZ3bXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgzOTI0NzgsImV4cCI6MjAwMzk2ODQ3OH0.Xh9cCxyrJD4NF8JFrYZqXlZCLNpC4Ot_2JsO-J9Dn-A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Kullanıcı profili işlemleri
export const getUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Profil alınırken hata:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Kullanıcı profili alınırken hata:', error);
    return null;
  }
};

// Soru kaydetme işlemi
export const saveQuestion = async (userId: string, question: string, answer: string) => {
  try {
    const { error } = await supabase
      .from('questions')
      .insert([
        { 
          user_id: userId,
          question,
          answer,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Soru kaydedilirken hata:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Soru kaydedilirken hata:', error);
    return false;
  }
};

// Soru işlemleri
export const submitQuestion = async (question: string, answer: string) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([
        { question, answer }
      ]);
    
    if (error) {
      console.error('Soru kaydedilirken hata:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Soru gönderilirken hata:', error);
    return false;
  }
};

// İstatistik işlemleri
export const getStatistics = async () => {
  try {
    // Önce localStorage'den kontrol et
    const cachedStatsStr = localStorage.getItem('cachedStats');
    const cachedTime = localStorage.getItem('cachedStatsTime');
    
    // Eğer önbelleğe alınmış istatistikler varsa ve 1 saatten daha yeni ise kullan
    if (cachedStatsStr && cachedTime) {
      const cachedStats = JSON.parse(cachedStatsStr);
      const cacheAge = Date.now() - parseInt(cachedTime);
      
      // Önbellek 1 saatten daha yeni ise kullan (3600000 ms = 1 saat)
      if (cacheAge < 3600000) {
        return cachedStats;
      }
    }
    
    // Toplam soru sayısı
    const { count: totalQuestions, error: questionsError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });
    
    if (questionsError) {
      console.error('Soru sayısı alınırken hata:', questionsError);
    }
    
    // Toplam ziyaretçi sayısı
    const { data: visitors, error: visitorsError } = await supabase
      .from('visitors')
      .select('count')
      .order('id', { ascending: false })
      .limit(1);
    
    if (visitorsError) {
      console.error('Ziyaretçi sayısı alınırken hata:', visitorsError);
    }
    
    // Toplam beğeni sayısı
    const { count: totalLikes, error: likesError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true });
    
    if (likesError) {
      console.error('Beğeni sayısı alınırken hata:', likesError);
    }
    
    const statistics = {
      totalQuestions: totalQuestions || 0,
      totalVisitors: visitors && visitors.length > 0 ? visitors[0].count : 0,
      totalLikes: totalLikes || 0
    };
    
    // İstatistikleri önbelleğe al
    localStorage.setItem('cachedStats', JSON.stringify(statistics));
    localStorage.setItem('cachedStatsTime', Date.now().toString());
    
    return statistics;
  } catch (error) {
    console.error('İstatistikler alınırken hata:', error);
    
    // Hata durumunda varsayılan değerleri döndür
    return {
      totalQuestions: 0,
      totalVisitors: 0,
      totalLikes: 0
    };
  }
};

// Ziyaretçi sayacı
export const incrementVisitorCount = async () => {
  try {
    // Daha önce sayılıp sayılmadığını kontrol et
    const visitorCounted = localStorage.getItem('visitorCounted');
    const lastCountTime = localStorage.getItem('lastCountTime');
    
    // Eğer kullanıcı daha önce sayılmışsa ve son 24 saat içindeyse, sayma
    if (visitorCounted === 'true' && lastCountTime) {
      const timeSinceLastCount = Date.now() - parseInt(lastCountTime);
      // 24 saat = 86400000 ms
      if (timeSinceLastCount < 86400000) {
        console.log('Bu ziyaretçi son 24 saat içinde zaten sayıldı.');
        return true;
      }
    }
    
    // Mevcut ziyaretçi sayısını kontrol et
    const { data: existingVisitors, error: selectError } = await supabase
      .from('visitors')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('Ziyaretçi verisi kontrol edilirken hata:', selectError);
      
      // Hata durumunda bile kullanıcıyı sayılmış olarak işaretle
      localStorage.setItem('visitorCounted', 'true');
      localStorage.setItem('lastCountTime', Date.now().toString());
      
      // Supabase erişilemese bile başarılı kabul et
      return true;
    }
    
    let success = false;
    
    if (existingVisitors && existingVisitors.length > 0) {
      // Ziyaretçi kaydı varsa, sayacı artır
      const { data, error: updateError } = await supabase.rpc('increment_visitor_count');
      
      if (updateError) {
        console.error('Ziyaretçi sayısı artırılırken hata:', updateError);
      } else {
        success = true;
      }
    } else {
      // Ziyaretçi kaydı yoksa, yeni kayıt oluştur
      const { data, error: insertError } = await supabase
        .from('visitors')
        .insert([{ count: 1 }]);
      
      if (insertError) {
        console.error('Ziyaretçi kaydı oluşturulurken hata:', insertError);
      } else {
        success = true;
      }
    }
    
    // Kullanıcıyı sayılmış olarak işaretle
    if (success) {
      localStorage.setItem('visitorCounted', 'true');
      localStorage.setItem('lastCountTime', Date.now().toString());
      
      // İstatistik önbelleğini temizle
      localStorage.removeItem('cachedStats');
      localStorage.removeItem('cachedStatsTime');
    }
    
    return success;
  } catch (error) {
    console.error('Ziyaretçi sayısı artırılırken hata:', error);
    
    // Hata durumunda bile kullanıcıyı sayılmış olarak işaretle
    localStorage.setItem('visitorCounted', 'true');
    localStorage.setItem('lastCountTime', Date.now().toString());
    
    return false;
  }
};

// Beğeni işlemleri
export const likeQuestion = async (questionId: string) => {
  try {
    // Daha önce beğenilip beğenilmediğini kontrol et
    const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '[]');
    
    if (likedQuestions.includes(questionId)) {
      console.log('Bu soru zaten beğenilmiş.');
      return true;
    }
    
    // Beğeni ekle
    const { data, error } = await supabase
      .from('likes')
      .insert([{ question_id: questionId }]);
    
    if (error) {
      console.error('Beğeni eklenirken hata:', error);
      
      // Eğer tablo bulunamadı hatası ise, başarılı kabul et
      if (error.code === '42P01') { // Tablo bulunamadı hatası
        console.log('Likes tablosu bulunamadı, simüle edildi.');
        
        // Beğeniyi localStorage'e kaydet
        likedQuestions.push(questionId);
        localStorage.setItem('likedQuestions', JSON.stringify(likedQuestions));
        
        return true;
      }
      
      // Diğer hatalar için başarısız kabul et
      return false;
    }
    
    // Beğeniyi localStorage'e kaydet
    likedQuestions.push(questionId);
    localStorage.setItem('likedQuestions', JSON.stringify(likedQuestions));
    
    // İstatistik önbelleğini temizle
    localStorage.removeItem('cachedStats');
    localStorage.removeItem('cachedStatsTime');
    
    return true;
  } catch (error) {
    console.error('Beğeni işlemi sırasında hata:', error);
    return false;
  }
};
