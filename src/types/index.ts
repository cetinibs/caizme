export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface Question {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export interface ContactForm {
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  source?: 'ai' | 'predefined' | 'fallback';
}
