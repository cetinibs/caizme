'use client';

import axios from 'axios';

// OpenRouter API için yapılandırma
const openRouterApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
const SITE_URL = 'https://caizme.com';
const SITE_NAME = 'Caizme - İslami Sorular';

// Yedek cevap üretme fonksiyonu
function generateFallbackResponse(question: string): string {
  // Basit soru kategorileri
  const questionLower = question.toLowerCase();
  
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
  } else {
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

// OpenRouter API'dan cevap almak için
async function getAIResponse(question: string): Promise<string> {
  try {
    console.log('OpenRouter API anahtarı var mı?', !!OPENROUTER_API_KEY);
    console.log('API anahtarı uzunluğu:', OPENROUTER_API_KEY.length);
    console.log('Soru:', question);
    
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.length < 10) {
      console.error('OpenRouter API anahtarı bulunamadı veya geçersiz!');
      return generateFallbackResponse(question);
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

    // Kullanıcı sorusunu geliştir ve zenginleştir
    const enhancedQuestion = await enhanceUserPrompt(question);
    console.log('Geliştirilmiş soru:', enhancedQuestion);

    // OpenRouter API isteği
    const response = await axios.post(
      openRouterApiUrl,
      {
        model: "deepseek/deepseek-r1:free", // OpenRouter üzerindeki DeepSeek modeli
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: enhancedQuestion
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
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME
        }
      }
    );

    console.log('API yanıtı:', response.data);

    // API'den dönen cevabı işle
    if (response.data && 
        response.data.choices && 
        response.data.choices.length > 0 && 
        response.data.choices[0].message &&
        response.data.choices[0].message.content) {
      
      // Cevabı formatla ve iyileştir
      const rawAnswer = response.data.choices[0].message.content.trim();
      return formatAnswer(rawAnswer);
    }

    return 'Üzgünüm, bu soruya cevap veremiyorum.';
  } catch (error) {
    console.error('AI API hatası:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      // API'nin döndüğü hata mesajını kontrol et
      console.error('API hata detayı:', error.response.data);
      
      // Rate limit veya diğer API hataları
      if (error.response.status === 429) {
        return 'Şu anda çok fazla istek var. Lütfen birkaç saniye sonra tekrar deneyin.';
      }
    }
    
    // Hata durumunda yedek cevap üret
    return generateFallbackResponse(question);
  }
}

// Cevabı formatla ve iyileştir
function formatAnswer(answer: string): string {
  // Markdown formatını iyileştir
  let formattedAnswer = answer;
  
  // Başlıkları düzenle
  formattedAnswer = formattedAnswer.replace(/^(#+)\s*(.*?)$/gm, (match, hashes, title) => {
    return `${hashes} ${title}`;
  });
  
  // Madde işaretlerini düzenle
  formattedAnswer = formattedAnswer.replace(/^\s*[-*]\s+(.*?)$/gm, (match, content) => {
    return `• ${content}`;
  });
  
  // Vurguları düzenle
  formattedAnswer = formattedAnswer.replace(/\*\*(.*?)\*\*/g, (match, content) => {
    return `**${content}**`;
  });
  
  // Paragrafları düzenle
  formattedAnswer = formattedAnswer.replace(/\n{3,}/g, '\n\n');
  
  return formattedAnswer;
}

// Kullanıcı promptunu geliştiren ve zenginleştiren fonksiyon
async function enhanceUserPrompt(question: string): Promise<string> {
  try {
    // Sorunun türüne göre uygun zenginleştirme yap
    const questionLower = question.toLowerCase();
    
    // Soru türünü belirle
    const isRulingQuestion = questionLower.includes('caiz mi') || 
                            questionLower.includes('haram mı') || 
                            questionLower.includes('helal mi') || 
                            questionLower.includes('günah mı') ||
                            questionLower.includes('sevap mı') ||
                            questionLower.includes('bozar mı') ||
                            questionLower.includes('gerekir mi');
                            
    const isHistoricalQuestion = questionLower.includes('ne zaman') || 
                                questionLower.includes('tarih') || 
                                questionLower.includes('geçmiş') ||
                                questionLower.includes('kimdir');
                                
    const isPracticalQuestion = questionLower.includes('nasıl') || 
                              questionLower.includes('ne şekilde') || 
                              questionLower.includes('hangi yolla');
    
    // Soru türüne göre ek bağlam oluştur
    let additionalContext = '';
    
    if (isRulingQuestion) {
      additionalContext = `
Lütfen bu soruyu dini bir hüküm sorusu olarak ele al ve aşağıdaki yönlerden detaylı bir cevap ver:
- Bu konudaki temel İslami hüküm nedir?
- Farklı mezheplerin (Hanefi, Şafi, Maliki, Hanbeli) bu konudaki görüşleri nelerdir?
- Bu hükmün dayandığı Kur'an ayetleri ve hadisler nelerdir?
- Günümüzde bu konuda nasıl bir uygulama yapılmalıdır?
- Konu hakkında dikkat edilmesi gereken özel durumlar var mıdır?
`;
    } else if (isHistoricalQuestion) {
      additionalContext = `
Lütfen bu soruyu tarihi bir soru olarak ele al ve aşağıdaki yönlerden detaylı bir cevap ver:
- Konunun tarihsel arka planı nedir?
- İslam tarihinde bu konunun önemi ve yeri nedir?
- Bu konuyla ilgili önemli tarihi olaylar ve kişiler kimlerdir?
- Konunun günümüze yansımaları nelerdir?
`;
    } else if (isPracticalQuestion) {
      additionalContext = `
Lütfen bu soruyu pratik bir uygulama sorusu olarak ele al ve aşağıdaki yönlerden detaylı bir cevap ver:
- Bu konuda İslami açıdan doğru uygulama nasıl olmalıdır?
- Uygulamanın adımları nelerdir?
- Yaygın hatalar ve bunlardan kaçınma yolları nelerdir?
- Farklı durumlarda nasıl uygulanmalıdır?
`;
    } else {
      // Genel sorular için
      additionalContext = `
Lütfen bu soruyu aşağıdaki yönlerden ele alarak detaylı bir cevap ver:
- Konunun İslami kaynaklardaki yeri ve önemi nedir?
- Farklı mezhep ve görüşlerin yaklaşımları nelerdir?
- Dayandığı deliller ve gerekçeler nelerdir?
- Günlük hayatta nasıl uygulanabileceğine dair öneriler nelerdir?
`;
    }
    
    // Orijinal soruyu koru ve ek bağlamı ekle
    const enhancedQuestion = `${question}\n${additionalContext}`;
    
    return enhancedQuestion;
  } catch (error) {
    console.error('Prompt geliştirme hatası:', error);
    // Hata durumunda orijinal soruyu döndür
    return question;
  }
}

// Alternatif model seçeneği eklenebilir
async function getAlternativeResponse(question: string): Promise<string> {
  try {
    // Alternatif bir model kullanılabilir
    const response = await axios.post(
      openRouterApiUrl,
      {
        model: "deepseek/deepseek-chat-v3", // Alternatif DeepSeek modeli
        messages: [
          {
            role: "system",
            content: "Sen İslami sorulara mantıklı ve düşünceli Türkçe cevaplar veren bir uzman asistansın."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.5,
        max_tokens: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME
        }
      }
    );

    if (response.data && 
        response.data.choices && 
        response.data.choices.length > 0 && 
        response.data.choices[0].message &&
        response.data.choices[0].message.content) {
      
      return response.data.choices[0].message.content.trim();
    }

    return 'Üzgünüm, bu soruya şu anda cevap veremiyorum.';
  } catch (error) {
    console.error('Alternatif AI API hatası:', error);
    throw error;
  }
}

// Farklı modellere göre cevap seçenekleri
const aiModels = {
  DEFAULT: getAIResponse,
  ALTERNATIVE: getAlternativeResponse,
};

export default aiModels;
