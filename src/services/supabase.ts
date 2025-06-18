'use client';

import { createClient } from '@supabase/supabase-js';

// Supabase bağlantı bilgileri
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lmfyeczfulmcxfyvwmxk.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZnllY3pmdWxtY3hmeXZ3bXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5MzA0MzMsImV4cCI6MjAyNTUwNjQzM30.Nt8OYDhXRyQl9WGqXJR6cqyQqxgQNWtrfPYxiVLIbMM';

// Supabase istemcisi oluştur
export const supabase = createClient(supabaseUrl, supabaseKey);

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

// Kullanıcının sorularını getirme
export const getUserQuestions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Kullanıcı soruları alınırken hata:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Kullanıcı soruları alınırken hata:', error);
    return [];
  }
};

// Soru kaydetme işlemi
export const saveQuestion = async (userId: string, question: string, answer: string) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .insert([
        {
          user_id: userId,
          question,
          answer,
          created_at: new Date().toISOString()
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Soru kaydedilirken hata:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Soru kaydedilirken hata:', error);
    return null;
  }
};

// Soru işlemleri
export const submitQuestion = async (question: string, answer: string) => {
  try {
    const { error } = await supabase
      .from('questions')
      .insert([
        { question, answer, created_at: new Date().toISOString() }
      ]);

    if (error) {
      console.error('Soru kaydedilirken hata:', error);
      return false;
    }

    // Soru başarıyla kaydedildiyse, istatistikleri güncelle
    try {
      // Veritabanından güncel istatistikleri al
      const updatedStats = await getStatistics();
      console.log('Soru eklendikten sonra güncel istatistikler:', updatedStats);

      // Önbelleği temizle, böylece bir sonraki istekte güncel veriler alınacak
      localStorage.removeItem('cachedStats');
      localStorage.removeItem('cachedStatsTime');
    } catch (e) {
      console.error('Güncel istatistikler alınırken hata:', e);
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

    // Eğer önbelleğe alınmış istatistikler varsa ve 5 dakikadan daha yeni ise kullan
    if (cachedStatsStr && cachedTime) {
      const cachedStats = JSON.parse(cachedStatsStr);
      const cacheAge = Date.now() - parseInt(cachedTime);

      // Önbellek 5 dakikadan daha yeni ise kullan (300000 ms = 5 dakika)
      if (cacheAge < 300000) {
        console.log('Önbellekten istatistikler kullanılıyor:', cachedStats);
        return cachedStats;
      }
    }

    // Veritabanından istatistikleri al - doğrudan sorgular kullanarak
    try {
      console.log('Veritabanından istatistikler alınıyor...');

      // Tüm istatistikleri ayrı ayrı sorgularla al
      let totalQuestions = 0;
      let totalVisitors = 0;
      let totalLikes = 0;

      // Toplam soru sayısı
      const { count: questionsCount, error: questionsError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      if (questionsError) {
        console.error('Soru sayısı alınırken hata:', questionsError);
      } else {
        totalQuestions = questionsCount || 0;
        console.log('Toplam soru sayısı:', totalQuestions);
      }

      // Toplam ziyaretçi sayısı
      const { data: visitorsData, error: visitorsError } = await supabase
        .from('visitors')
        .select('count');

      if (visitorsError) {
        console.error('Ziyaretçi sayısı alınırken hata:', visitorsError);
      } else {
        // Tüm ziyaretçi kayıtlarının count değerlerini topla
        totalVisitors = visitorsData?.reduce((sum, record) => sum + (record.count || 0), 0) || 0;
        console.log('Toplam ziyaretçi sayısı (count toplamı):', totalVisitors);
      }

      // Toplam beğeni sayısı
      const { count: likesCount, error: likesError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true });

      if (likesError) {
        console.error('Beğeni sayısı alınırken hata:', likesError);
      } else {
        totalLikes = likesCount || 0;
        console.log('Toplam beğeni sayısı:', totalLikes);
      }

      // Tüm istatistikleri birleştir
      const statistics = {
        totalQuestions,
        totalVisitors,
        totalLikes
      };

      console.log('Veritabanından alınan istatistikler:', statistics);

      // İstatistikleri önbelleğe al
      localStorage.setItem('cachedStats', JSON.stringify(statistics));
      localStorage.setItem('cachedStatsTime', Date.now().toString());

      return statistics;
    } catch (dbError) {
      console.error('Veritabanından istatistikler alınırken hata:', dbError);

      // Veritabanı hatası durumunda, yedek yöntem olarak ayrı ayrı sorgular yap
      let totalQuestions = 0;
      let totalVisitors = 0;
      let totalLikes = 0;

      try {
        // Toplam soru sayısı - doğrudan sayma
        const { count: questionsCount, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        if (questionsError) {
          console.error('Soru sayısı alınırken hata:', questionsError);
        } else {
          totalQuestions = questionsCount || 0;
          console.log('Toplam soru sayısı:', totalQuestions);
        }
      } catch (e) {
        console.error('Soru sayısı alınırken hata:', e);
      }

      try {
        // Toplam ziyaretçi sayısı - tüm kayıtları getir ve count değerlerini topla
        const { data: visitorsData, error: visitorsError } = await supabase
          .from('visitors')
          .select('count');

        if (visitorsError) {
          console.error('Ziyaretçi sayısı alınırken hata:', visitorsError);
        } else {
          // Tüm ziyaretçi kayıtlarının count değerlerini topla
          totalVisitors = visitorsData?.reduce((sum, record) => sum + (record.count || 0), 0) || 0;
          console.log('Toplam ziyaretçi sayısı (count toplamı):', totalVisitors);
        }
      } catch (e) {
        console.error('Ziyaretçi sayısı alınırken hata:', e);
      }

      try {
        // Toplam beğeni sayısı - doğrudan sayma
        const { count: likesCount, error: likesError } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true });

        if (likesError) {
          console.error('Beğeni sayısı alınırken hata:', likesError);
        } else {
          totalLikes = likesCount || 0;
          console.log('Toplam beğeni sayısı:', totalLikes);
        }
      } catch (e) {
        console.error('Beğeni sayısı alınırken hata:', e);
      }

      const statistics = {
        totalQuestions,
        totalVisitors,
        totalLikes
      };

      console.log('Yedek yöntemle alınan istatistikler:', statistics);

      // İstatistikleri önbelleğe al
      localStorage.setItem('cachedStats', JSON.stringify(statistics));
      localStorage.setItem('cachedStatsTime', Date.now().toString());

      return statistics;
    }
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

    // Eğer kullanıcı daha önce sayılmışsa ve son 30 dakika içindeyse, sayma
    // Test için 24 saat yerine 30 dakika olarak değiştirildi
    if (visitorCounted === 'true' && lastCountTime) {
      const timeSinceLastCount = Date.now() - parseInt(lastCountTime);
      // 30 dakika = 1800000 ms
      if (timeSinceLastCount < 1800000) {
        console.log('Bu ziyaretçi son 30 dakika içinde zaten sayıldı.');
        return true;
      }
    }

    // Bugünün tarihini YYYY-MM-DD formatında al
    const today = new Date().toISOString().split('T')[0];
    console.log('Ziyaretçi sayısı artırılıyor, tarih:', today);

    let updateSuccess = false;

    try {
      // Önce bugün için kayıt var mı kontrol et
      const { data: existingVisit, error: checkError } = await supabase
        .from('visitors')
        .select('*')
        .eq('date', today)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          // Kayıt bulunamadı, yeni kayıt oluştur
          console.log('Bugün için ziyaretçi kaydı bulunamadı, yeni kayıt oluşturuluyor...');
          const { error: insertError } = await supabase
            .from('visitors')
            .insert([{
              date: today,
              count: 1
            }]);

          if (insertError) {
            console.warn('Yeni ziyaretçi kaydı oluşturulurken hata (geliştirme modunda normal):', insertError.message);
          } else {
            console.log('Yeni ziyaretçi kaydı başarıyla oluşturuldu.');
            updateSuccess = true;
          }
        } else {
          console.warn('Ziyaretçi kaydı kontrolünde hata (geliştirme modunda normal):', checkError.message);
        }
      } else if (existingVisit) {
        // Eğer bugün için kayıt varsa, sayıyı artır
        console.log('Mevcut ziyaretçi kaydı bulundu, sayı güncelleniyor. Mevcut sayı:', existingVisit.count);
        const { error: updateError } = await supabase
          .from('visitors')
          .update({ count: existingVisit.count + 1 })
          .eq('date', today);

        if (updateError) {
          console.warn('Ziyaretçi sayısı güncellenirken hata (geliştirme modunda normal):', updateError.message);
        } else {
          console.log('Ziyaretçi sayısı başarıyla güncellendi.');
          updateSuccess = true;
        }
      }
    } catch (dbError) {
      console.warn('Veritabanı işlemi sırasında hata (geliştirme modunda normal):', dbError);
    }

    // Başarılı veya başarısız, kullanıcıyı sayılmış olarak işaretle
    localStorage.setItem('visitorCounted', 'true');
    localStorage.setItem('lastCountTime', Date.now().toString());

    // İstatistik önbelleğini güncelle - veritabanından güncel verileri al
    if (updateSuccess) {
      try {
        // Veritabanından güncel istatistikleri al
        const updatedStats = await getStatistics();
        console.log('Ziyaretçi sayısı artırıldıktan sonra güncel istatistikler:', updatedStats);

        // Önbelleği temizle, böylece bir sonraki istekte güncel veriler alınacak
        localStorage.removeItem('cachedStats');
        localStorage.removeItem('cachedStatsTime');
      } catch (e) {
        console.error('Güncel istatistikler alınırken hata:', e);
      }
    }

    return updateSuccess;
  } catch (error) {
    console.warn('Ziyaretçi sayısı artırılırken hata (geliştirme modunda normal):', error);

    // Hata durumunda bile kullanıcıyı sayılmış olarak işaretle
    localStorage.setItem('visitorCounted', 'true');
    localStorage.setItem('lastCountTime', Date.now().toString());

    return false;
  }
};

// Beğeni işlemleri
export const likeQuestion = async (questionId: string) => {
  try {
    // Kullanıcının oturum bilgisini al
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    const clientId = localStorage.getItem('clientId') || `anonymous-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // ClientId'yi kaydet
    if (!localStorage.getItem('clientId')) {
      localStorage.setItem('clientId', clientId);
    }

    // Kullanıcı giriş yapmış mı kontrol et
    if (userId) {
      // Kullanıcının bu soruyu daha önce beğenip beğenmediğini kontrol et
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('Beğeni kontrolü sırasında hata:', checkError);
      }

      // Eğer kullanıcı bu soruyu zaten beğenmişse, işlemi sonlandır
      if (existingLike) {
        console.log('Bu soru zaten beğenilmiş.');
        return true;
      }
    } else {
      // Giriş yapmamış kullanıcılar için client_id ile kontrol et
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('question_id', questionId)
        .eq('client_id', clientId)
        .maybeSingle();

      if (checkError) {
        console.error('Beğeni kontrolü sırasında hata:', checkError);
      }

      // Eğer kullanıcı bu soruyu zaten beğenmişse, işlemi sonlandır
      if (existingLike) {
        console.log('Bu soru zaten beğenilmiş.');
        return true;
      }
    }

    try {
      // Önce soruyu al ve mevcut beğeni sayısını kontrol et
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .select('likes_count, id')
        .eq('id', questionId)
        .maybeSingle();

      if (questionError) {
        console.error('Soru bilgisi alınırken hata:', questionError);
        return false;
      }

      // Soru bulunamadıysa, hata döndür
      if (!questionData) {
        console.error('Soru bulunamadı:', questionId);
        return false;
      }

      // Mevcut beğeni sayısı (yoksa 0)
      const currentLikes = questionData.likes_count || 0;

      // Beğeni sayısını artır
      const { error: updateError } = await supabase
        .from('questions')
        .update({ likes_count: currentLikes + 1 })
        .eq('id', questionId);

      if (updateError) {
        console.error('Beğeni sayısı güncellenirken hata:', updateError);
        return false;
      }

      console.log('Beğeni sayısı başarıyla güncellendi.');
    } catch (e) {
      console.error('Soru güncelleme hatası:', e);
      return false;
    }

    try {
      // Likes tablosuna ekle
      const { error: likesError } = await supabase
        .from('likes')
        .insert([{
          question_id: questionId,
          user_id: userId || null, // Kullanıcı giriş yapmamışsa null olacak
          client_id: !userId ? clientId : null, // Kullanıcı giriş yapmamışsa client_id kullan
          created_at: new Date().toISOString()
        }]);

      if (likesError) {
        console.error('Likes tablosuna eklenirken hata:', likesError);
        return false;
      }

      console.log('Likes tablosuna başarıyla eklendi.');
    } catch (e) {
      console.error('Likes tablosuna ekleme hatası:', e);
      return false;
    }

    // Giriş yapmamış kullanıcılar için localStorage'e de kaydet
    try {
      const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '[]');
      if (!likedQuestions.includes(questionId)) {
        likedQuestions.push(questionId);
        localStorage.setItem('likedQuestions', JSON.stringify(likedQuestions));
      }
    } catch (e) {
      console.error('LocalStorage hatası:', e);
    }

    // İstatistik önbelleğini güncelle - veritabanından güncel verileri al
    try {
      // Veritabanından güncel istatistikleri al
      const updatedStats = await getStatistics();
      console.log('Beğeni eklendikten sonra güncel istatistikler:', updatedStats);

      // Önbelleği temizle, böylece bir sonraki istekte güncel veriler alınacak
      localStorage.removeItem('cachedStats');
      localStorage.removeItem('cachedStatsTime');
    } catch (e) {
      console.error('Güncel istatistikler alınırken hata:', e);
    }

    return true;
  } catch (error) {
    console.error('Beğeni işlemi sırasında hata:', error);
    return false;
  }
};

// Kullanıcının bir soruyu beğenip beğenmediğini kontrol et
export const checkUserLiked = async (questionId: string) => {
  try {
    // Kullanıcının oturum bilgisini al
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;
    const clientId = localStorage.getItem('clientId');

    // Kullanıcı giriş yapmışsa veritabanından kontrol et
    if (userId) {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('question_id', questionId)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Beğeni durumu kontrol edilirken hata:', error);
        return false;
      }

      return !!data; // data varsa true, yoksa false döner
    } else if (clientId) {
      // Kullanıcı giriş yapmamış ama client_id varsa veritabanından kontrol et
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('question_id', questionId)
        .eq('client_id', clientId)
        .maybeSingle();

      if (error) {
        console.error('Beğeni durumu kontrol edilirken hata:', error);
        // Hata durumunda localStorage'e bak
        try {
          const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '[]');
          return likedQuestions.includes(questionId);
        } catch (e) {
          console.error('LocalStorage hatası:', e);
          return false;
        }
      }

      return !!data; // data varsa true, yoksa false döner
    } else {
      // Kullanıcı giriş yapmamış ve client_id yoksa localStorage'den kontrol et
      try {
        const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '[]');
        return likedQuestions.includes(questionId);
      } catch (e) {
        console.error('LocalStorage hatası:', e);
        return false;
      }
    }
  } catch (error) {
    console.error('Beğeni durumu kontrol edilirken hata:', error);
    return false;
  }
};

// Kullanıcının beğendiği tüm soruları getir
export const getUserLikedQuestions = async () => {
  try {
    // Kullanıcının oturum bilgisini al
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Kullanıcı giriş yapmışsa veritabanından getir
    if (userId) {
      const { data, error } = await supabase
        .from('likes')
        .select('question_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Beğenilen sorular alınırken hata:', error);
        return [];
      }

      return data.map(like => like.question_id);
    } else {
      // Kullanıcı giriş yapmamışsa localStorage'den getir
      try {
        return JSON.parse(localStorage.getItem('likedQuestions') || '[]');
      } catch (e) {
        console.error('LocalStorage hatası:', e);
        return [];
      }
    }
  } catch (error) {
    console.error('Beğenilen sorular alınırken hata:', error);
    return [];
  }
};
