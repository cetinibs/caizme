'use client';

import axios from 'axios';
import { ApiResponse, ContactForm } from '@/types';
import { supabase } from './supabase';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const askQuestion = async (question: string): Promise<ApiResponse<string>> => {
  try {
    console.log('Soru gönderiliyor:', question.substring(0, 50) + '...');
    
    // Kullanıcı oturumu varsa, token'ı al ve isteğe ekle
    let token = null;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      token = data.session.access_token;
    }

    // Doğrudan OpenRouter API rotasına istek gönder
    const response = await api.post('/openrouter', { question, token });
    
    console.log('API yanıtı alındı, durum:', response.status);
    
    if (response.data && response.data.answer) {
      return { 
        data: response.data.answer,
        source: response.data.source || 'ai'
      };
    } else {
      console.error('API yanıtı beklenen formatta değil:', JSON.stringify(response.data).substring(0, 200));
      return { error: 'Yanıt alınamadı. Lütfen daha sonra tekrar deneyin.' };
    }
  } catch (error) {
    console.error('Soru sorma hatası:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios hata detayları:', 
        error.response?.status, 
        error.response?.data ? JSON.stringify(error.response.data).substring(0, 200) : 'Veri yok'
      );
      return { error: error.response?.data?.message || error.response?.data?.error || 'Bir hata oluştu.' };
    }
    return { error: 'Beklenmeyen bir hata oluştu.' };
  }
};

export const submitContactForm = async (formData: ContactForm): Promise<ApiResponse<string>> => {
  try {
    const response = await api.post('/contact', formData);
    return { data: response.data.message };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || 'Form gönderilirken bir hata oluştu.' };
    }
    return { error: 'Beklenmeyen bir hata oluştu.' };
  }
};
