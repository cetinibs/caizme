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
    // Kullanıcı oturumu varsa, token'ı al ve isteğe ekle
    let token = null;
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      token = data.session.access_token;
    }

    const response = await api.post('/ask', { question, token });
    return { data: response.data.answer };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || 'Bir hata oluştu.' };
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
