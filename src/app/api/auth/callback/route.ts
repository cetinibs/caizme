import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    try {
      // Exchange the auth code for a session
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
    }
  }
  
  // Başarılı oturum açma durumunda kullanıcıyı ana sayfaya yönlendir
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
