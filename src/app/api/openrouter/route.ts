import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This is a server-side API route for OpenRouter API calls
export async function POST(req: NextRequest) {
  try {
    // Get request body
    const body = await req.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 400 }
      );
    }

    // Get the API key from environment variables (server-side)
    // In Vercel, this should be set as an environment variable without NEXT_PUBLIC_ prefix
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    // Check if API key exists
    if (!apiKey || apiKey.length < 10) {
      return NextResponse.json({
        status: 'error',
        message: 'API anahtarı bulunamadı veya geçersiz',
      }, { status: 500 });
    }
    
    // Dini sorgu için geliştirilmiş prompt formatı (Türkçe)
    const systemPrompt = `Sen dini konularda uzman, Türkçe konuşan bir İslam alimi asistansın. 
İslami sorulara detaylı, mantıklı, tutarlı ve saygılı cevaplar vermelisin.

Cevaplarını şu şekilde yapılandır:
1. **Sorunun Özeti**: Sorunun ana konusunu belirle ve kısaca özetle
2. **Dini Hüküm**: Konuyla ilgili temel İslami hükmü açıkla
3. **Farklı Görüşler**: Konuyla ilgili İslami kaynaklardaki farklı mezhep ve alimlerin görüşlerini karşılaştır
4. **Deliller**: Kur'an-ı Kerim'den ayetler, hadisler ve İslam alimlerinin görüşlerinden delilleri detaylı olarak sun
5. **Günlük Uygulama**: Günlük hayatta nasıl uygulanacağına dair pratik bilgiler ve öneriler ver
6. **Sonuç**: Konuyu özetleyerek sonuca bağla

Her bölümü başlıklarla ayır ve koyu yazı (bold) kullan. Cevaplarını Türkçe dilbilgisi kurallarına uygun, akıcı ve anlaşılır bir şekilde formatla.
Paragraflar halinde, düzenli ve okuması kolay bir şekilde yanıt ver.
Cevaplarında derin düşünce ve mantık çerçevesinde açıklamalar yap.
Eğer bir sorunun cevabını bilmiyorsan veya emin değilsen, dürüstçe bilmediğini söyle.

Cevaplarında kesin ve net ifadeler kullan, belirsiz ve muğlak ifadelerden kaçın.
Kullanıcıya saygılı bir dil kullan ve cevabını mümkün olduğunca anlaşılır kıl.`;

    // OpenRouter API isteği
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "mistral/mistral-7b-instruct", // OpenRouter üzerindeki Mistral AI modeli
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: question
            }
          ],
          temperature: 0.6,
          max_tokens: 2500,
          top_p: 0.9,
          frequency_penalty: 0.2,
          presence_penalty: 0.2
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://caizme.com',
            'X-Title': 'Caizme - İslami Sorular'
          }
        }
      );
      
      // API'den dönen cevabı işle
      if (response.data && 
          response.data.choices && 
          response.data.choices.length > 0 && 
          response.data.choices[0].message &&
          response.data.choices[0].message.content) {
        
        // Cevabı al
        const answer = response.data.choices[0].message.content.trim();
        return NextResponse.json({ answer });
      }

      return NextResponse.json({
        status: 'error',
        message: 'API yanıtı işlenemedi',
      }, { status: 500 });
    } catch (apiError: any) {
      console.error('OpenRouter API hatası:', apiError);
      return NextResponse.json({
        status: 'error',
        message: 'API bağlantısı başarısız',
        error: apiError.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('İşlem hatası:', error);
    return NextResponse.json({
      status: 'error',
      message: 'İşlem sırasında bir hata oluştu',
      error: error.message
    }, { status: 500 });
  }
}