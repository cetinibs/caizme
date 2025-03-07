'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const saveQuestion = async (userId: string, question: string, answer: string) => {
  const { data, error } = await supabase
    .from('questions')
    .insert([
      { user_id: userId, question, answer, created_at: new Date() }
    ]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const getUserQuestions = async (userId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

export const deleteAllUserQuestions = async (userId: string) => {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return true;
};

// İstatistikleri getiren fonksiyon
export const getStatistics = async (): Promise<{
  totalQuestions: number;
  totalVisitors: number;
  totalLikes: number;
}> => {
  try {
    // Toplam soru sayısını al
    const { count: totalQuestions, error: questionsError } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true });

    if (questionsError) throw questionsError;

    // Toplam ziyaretçi sayısını al
    const { count: totalVisitors, error: visitorsError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (visitorsError) throw visitorsError;

    // Toplam beğeni sayısını al
    const { count: totalLikes, error: likesError } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true });

    if (likesError) throw likesError;

    return {
      totalQuestions: totalQuestions || 0,
      totalVisitors: totalVisitors || 0,
      totalLikes: totalLikes || 0
    };
  } catch (error) {
    console.error('İstatistikler alınırken hata oluştu:', error);
    return {
      totalQuestions: 0,
      totalVisitors: 0,
      totalLikes: 0
    };
  }
};

// Ziyaretçi sayısını artır
export const incrementVisitorCount = async (): Promise<void> => {
  try {
    // Bugünün tarihini al
    const today = new Date().toISOString().split('T')[0];
    
    // Bugün için ziyaretçi kaydı var mı kontrol et
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .eq('date', today)
      .single();
    
    if (error && error.code !== 'PGSQL_ERROR_NO_ROWS') {
      throw error;
    }
    
    if (data) {
      // Mevcut kaydı güncelle
      await supabase
        .from('visitors')
        .update({ count: data.count + 1 })
        .eq('id', data.id);
    } else {
      // Yeni kayıt oluştur
      await supabase
        .from('visitors')
        .insert({ date: today, count: 1 });
    }
  } catch (error) {
    console.error('Ziyaretçi sayısı artırılırken hata oluştu:', error);
  }
};

// Soruyu beğen
export const likeQuestion = async (questionId: string): Promise<void> => {
  try {
    await supabase
      .from('likes')
      .insert({ question_id: questionId });
  } catch (error) {
    console.error('Soru beğenilirken hata oluştu:', error);
  }
};
