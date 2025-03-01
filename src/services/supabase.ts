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
