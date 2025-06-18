import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { checkPredefinedAnswer } from '@/services/predefinedAnswers';

// This is a server-side API route for OpenRouter API calls
export async function POST(req: NextRequest) {
  try {
    // Get request body
    const body = await req.json();
    const { question, token } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Soru bulunamadı' },
        { status: 400 }
      );
    }
    
    // Önceden tanımlanmış cevapları kontrol et
    console.log('Önceden tanımlanmış cevaplar kontrol ediliyor...');
    const predefinedAnswer = await checkPredefinedAnswer(question);
    
    if (predefinedAnswer) {
      console.log('Önceden tanımlanmış cevap bulundu');
      return NextResponse.json({ 
        answer: predefinedAnswer,
        source: 'predefined'
      });
    }
    
    console.log('Önceden tanımlanmış cevap bulunamadı, AI\'ya soruluyor...');

    // Get the API key from environment variables (server-side)
    // In Vercel, this should be set as an environment variable without NEXT_PUBLIC_ prefix
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    // Check if API key exists
    if (!apiKey || apiKey.length < 10) {
      console.error('API anahtarı bulunamadı veya geçersiz:', apiKey);
      
      // Yedek cevap döndür
      const fallbackAnswer = generateFallbackResponse(question);
      return NextResponse.json({
        answer: fallbackAnswer,
        status: 'fallback',
        error: 'API anahtarı bulunamadı veya geçersiz'
      });
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
      console.log('OpenRouter API isteği gönderiliyor...');
      console.log('Soru:', question);
      console.log('API Anahtarı uzunluğu:', apiKey ? apiKey.length : 0);
      
      // Kullanılabilir modeller:
      // 1. "deepseek/deepseek-r1:free" - Ücretsiz DeepSeek modeli
      // 2. "deepseek/deepseek-chat-v3" - Alternatif DeepSeek modeli
      // 3. "mistralai/mistral-7b-instruct" - Mistral AI modeli
      // 4. "google/gemma-7b-it" - Google Gemma modeli
      
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: "deepseek/deepseek-r1:free", // OpenRouter üzerindeki DeepSeek modeli
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
      
      console.log('OpenRouter API yanıtı alındı:', response.status);
      console.log('OpenRouter API yanıt detayları:', JSON.stringify(response.data).substring(0, 200));
      
      // API'den dönen cevabı işle
      if (response.data && 
          response.data.choices && 
          response.data.choices.length > 0 && 
          response.data.choices[0].message &&
          response.data.choices[0].message.content) {
        
        // Cevabı al
        const answer = response.data.choices[0].message.content.trim();
        return NextResponse.json({ answer });
      } else {
        console.error('API yanıtı beklenen formatta değil:', response.data);
        
        // Yedek cevap döndür
        const fallbackAnswer = generateFallbackResponse(question);
        return NextResponse.json({
          answer: fallbackAnswer,
          status: 'fallback',
          error: 'API yanıtı işlenemedi'
        });
      }
    } catch (apiError: any) {
      console.error('OpenRouter API hatası:', apiError.message);
      
      // Hata detaylarını kontrol et
      if (apiError.response) {
        console.error('API yanıt detayları:', {
          status: apiError.response.status,
          data: apiError.response.data
        });
      }
      
      // Yedek cevap oluştur
      const fallbackAnswer = generateFallbackResponse(question);
      
      return NextResponse.json({ 
        answer: fallbackAnswer,
        status: 'fallback',
        error: apiError.message
      });
    }
  } catch (error: any) {
    console.error('İşlem hatası:', error);
    
    // Genel yedek cevap döndür
    const fallbackAnswer = generateFallbackResponse("genel soru");
    
    return NextResponse.json({
      answer: fallbackAnswer,
      status: 'error',
      message: 'İşlem sırasında bir hata oluştu',
      error: error.message
    });
  }
}

// Yedek cevap üretme fonksiyonu
function generateFallbackResponse(question: string): string {
  // Basit soru kategorileri
  const questionLower = question.toLowerCase();
  
  // Özel soru tipleri için özelleştirilmiş cevaplar
  if (questionLower.includes('namaz') || questionLower.includes('abdest') || questionLower.includes('ibadet')) {
    return `
**Sorunun Özeti**
Sorunuz ibadet konusuyla ilgilidir.

**Dini Hüküm**
İbadet, İslam'ın temel şartlarından biridir ve her Müslümanın yerine getirmesi gereken bir görevdir.

**Farklı Görüşler**
Bu konuda tüm İslam alimleri ibadetlerin önemini vurgulamaktadır.

**Deliller**
Kur'an-ı Kerim'de "Ben cinleri ve insanları, ancak bana kulluk etsinler diye yarattım." (Zariyat Suresi, 56) buyrulmaktadır.

**Günlük Uygulama**
İbadetlerinizi düzenli olarak ve samimiyetle yerine getirmeniz tavsiye edilir.

**Sonuç**
İbadet, Allah'a yakınlaşmanın ve O'nun rızasını kazanmanın en önemli yollarından biridir.
`;
  } else if (questionLower.includes('oruç') || questionLower.includes('ramazan')) {
    return `
**Sorunun Özeti**
Sorunuz oruç ibadetiyle ilgilidir.

**Dini Hüküm**
Oruç, İslam'ın beş şartından biridir ve Ramazan ayında tutulması farzdır.

**Farklı Görüşler**
Tüm mezhepler orucun farz olduğu konusunda hemfikirdir.

**Deliller**
Kur'an-ı Kerim'de "Ey iman edenler! Oruç sizden öncekilere farz kılındığı gibi size de farz kılındı." (Bakara Suresi, 183) buyrulmaktadır.

**Günlük Uygulama**
Ramazan ayında imsak vaktinden iftar vaktine kadar yeme, içme ve diğer orucu bozan şeylerden uzak durulmalıdır.

**Sonuç**
Oruç, sabrı öğreten ve takva bilincini geliştiren önemli bir ibadettir.
`;
  } else if (questionLower.includes('zekat') || questionLower.includes('sadaka')) {
    return `
**Sorunun Özeti**
Sorunuz zekat veya sadaka konusuyla ilgilidir.

**Dini Hüküm**
Zekat, İslam'ın beş şartından biridir ve belirli bir nisaba ulaşan Müslümanların mallarının bir kısmını ihtiyaç sahiplerine vermeleri farzdır.

**Farklı Görüşler**
Tüm mezhepler zekatın farz olduğu konusunda hemfikirdir, ancak nisap miktarı ve zekat verilecek mallar konusunda bazı farklılıklar vardır.

**Deliller**
Kur'an-ı Kerim'de "Namazı kılın, zekatı verin..." (Bakara Suresi, 43) buyrulmaktadır.

**Günlük Uygulama**
Yıllık olarak mallarınızın zekatını hesaplayıp ihtiyaç sahiplerine vermeniz gerekmektedir.

**Sonuç**
Zekat, toplumsal dayanışmayı sağlayan ve servetin adil dağılımına katkıda bulunan önemli bir ibadettir.
`;
  } else if (questionLower.includes('hac') || questionLower.includes('umre')) {
    return `
**Sorunun Özeti**
Sorunuz hac veya umre ibadetiyle ilgilidir.

**Dini Hüküm**
Hac, İslam'ın beş şartından biridir ve gücü yeten her Müslümanın ömründe bir kez yerine getirmesi farzdır.

**Farklı Görüşler**
Tüm mezhepler haccın farz olduğu konusunda hemfikirdir.

**Deliller**
Kur'an-ı Kerim'de "Yoluna gücü yetenlerin o evi (Kabe'yi) haccetmesi, Allah'ın insanlar üzerindeki hakkıdır." (Al-i İmran Suresi, 97) buyrulmaktadır.

**Günlük Uygulama**
Hac ibadetini yerine getirmek için gerekli maddi ve fiziksel imkanlara sahip olduğunuzda bu ibadeti geciktirmeden yerine getirmeniz tavsiye edilir.

**Sonuç**
Hac, Müslümanların birlik ve beraberliğini sağlayan, manevi arınmayı ve yenilenmeyi sağlayan önemli bir ibadettir.
`;
  } else if (questionLower.includes('dua') || questionLower.includes('zikir')) {
    return `
**Sorunun Özeti**
Sorunuz dua veya zikir konusuyla ilgilidir.

**Dini Hüküm**
Dua, kulun Allah ile iletişim kurmasının en önemli yoludur ve her Müslümanın hayatında önemli bir yer tutmalıdır.

**Farklı Görüşler**
Tüm İslam alimleri duanın önemini vurgulamaktadır.

**Deliller**
Kur'an-ı Kerim'de "Bana dua edin, duanıza cevap vereyim." (Mümin Suresi, 60) buyrulmaktadır.

**Günlük Uygulama**
Günlük hayatınızda düzenli olarak dua etmeniz ve Allah'ı zikretmeniz tavsiye edilir.

**Sonuç**
Dua ve zikir, kalpleri huzura kavuşturan ve Allah ile bağı güçlendiren önemli ibadetlerdir.
`;
  } else {
    // Genel yedek cevap
    return `
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
