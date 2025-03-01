import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';
import aiModels from '@/services/ai';

export async function POST(req: NextRequest) {
  try {
    // Request gövdesini al
    const body = await req.json();
    const { question, token } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 400 }
      );
    }

    console.log('Soru alındı:', question);

    try {
      // DeepSeek API ile sorguyu gönder
      const answer = await aiModels.DEFAULT(question);
      console.log('AI yanıtı alındı');
      
      // Token ile kullanıcı oturum kontrolü (eğer token varsa)
      let userId = null;
      if (token) {
        try {
          const { data, error } = await supabase.auth.getUser(token);
          if (!error && data.user) {
            userId = data.user.id;
            
            // Eğer kullanıcı kimliği varsa, soruyu veritabanına kaydet
            if (userId) {
              const { error: saveError } = await supabase
                .from('questions')
                .insert([
                  { 
                    user_id: userId, 
                    question, 
                    answer,
                    created_at: new Date().toISOString()
                  }
                ]);
              
              if (saveError) {
                console.error('Soru kaydedilemedi:', saveError);
              }
            }
          }
        } catch (authError) {
          console.error('Kullanıcı kimliği doğrulanamadı:', authError);
        }
      }
      
      return NextResponse.json({ answer });
    } catch (aiError) {
      console.error('AI API hatası:', aiError);
      
      // Yedek olarak, eğer API çalışmazsa temel yanıtlar ver
      return NextResponse.json({ 
        answer: "Üzgünüm, şu anda sorgunuzu işleyemiyorum. Lütfen daha sonra tekrar deneyin veya sorunuzu farklı bir şekilde ifade edin." 
      });
    }
  } catch (error) {
    console.error('API hatası:', error);
    if (error instanceof Error) {
      console.error('Hata mesajı:', error.message);
      console.error('Hata stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'İşleminiz gerçekleştirilemedi. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
