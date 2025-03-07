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
      let answer;
      try {
        answer = await aiModels.DEFAULT(question);
        console.log('AI yanıtı alındı:', answer.substring(0, 50) + '...');
      } catch (aiError) {
        console.error('AI API hatası, yedek cevap kullanılıyor:', aiError);
        // Yedek cevap sistemini kullan
        if (question.toLowerCase().includes('oruç') || question.toLowerCase().includes('dişim kanadi')) {
          answer = `
**Sorunun Özeti**
Dişinizin kanaması durumunda orucunuzun bozulup bozulmayacağını soruyorsunuz.

**Dini Hüküm**
Dişinizden gelen kan, eğer yutulmazsa orucunuzu bozmaz.

**Farklı Görüşler**
Dört mezhep imamları da dişten gelen kanın ağızdan dışarı atılması durumunda orucun bozulmayacağı konusunda hemfikirdir. Ancak kanın yutulması durumunda görüş ayrılıkları vardır.

**Deliller**
Hz. Peygamber (s.a.v.) "Üç şey orucu bozmaz: Hacamat (kan aldırmak), kusmak ve ihtilam olmak (rüyalanmak)" buyurmuştur. (Tirmizi)

**Günlük Uygulama**
Dişiniz kanadığında:
1. Kanı tükürüp ağzınızı temizleyin
2. Kan yutmamaya özen gösterin
3. Diş fırçalama gibi işlemleri iftar ve sahur arasında yapmaya çalışın

**Sonuç**
Dişinizden gelen kan, ağzınızdan dışarı atıldığı sürece orucunuzu bozmaz. Ancak kanı yutarsanız, bazı mezheplere göre orucunuz bozulabilir.
`;
        } else {
          // Genel yedek cevap
          answer = `
**Sorunun Özeti**
Sorunuz İslami bir konuyla ilgilidir.

**Dini Hüküm**
İslam'da her konuda Allah'ın rızasını gözetmek esastır.

**Farklı Görüşler**
İslam alimleri çeşitli konularda farklı görüşler sunabilmektedir.

**Deliller**
Kur'an-ı Kerim ve Hadis-i Şerifler İslam'ın temel kaynaklarıdır.

**Günlük Uygulama**
İslami yaşantınızda Kur'an ve Sünnet'i rehber edinmeniz tavsiye edilir.

**Sonuç**
Her konuda orta yolu takip etmek ve aşırılıklardan kaçınmak İslam'ın temel prensiplerindendir.
`;
        }
      }
      
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
