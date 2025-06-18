'use client';

import axios from 'axios';

// OpenRouter API için yapılandırma
const openRouterApiUrl = 'https://openrouter.ai/api/v1/chat/completions';
// Client-side environment variables should use process.env.NEXT_PUBLIC_*
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
    console.log('Soru:', question);

    // Kullanıcı sorusunu geliştir ve zenginleştir
    const enhancedQuestion = await enhanceUserPrompt(question);
    console.log('Geliştirilmiş soru:', enhancedQuestion);

    // Server-side API endpoint'i kullan
    try {
      console.log('OpenRouter API isteği başlatılıyor...');
      const response = await axios.post('/api/openrouter', {
        question: enhancedQuestion
      });

      // API yanıtını detaylı logla
      console.log('API yanıtı alındı:', response.status);
      console.log('API yanıt içeriği:', response.data ? 'Veri mevcut' : 'Veri yok');

      // API'den dönen cevabı işle
      if (response.data && response.data.answer) {
        console.log('Cevap formatlanıyor...');
        // Cevabı formatla ve iyileştir
        return formatAnswer(response.data.answer);
      }

      console.error('API yanıtı beklenen formatta değil:', JSON.stringify(response.data).substring(0, 200));
      return 'Üzgünüm, bu soruya cevap veremiyorum.';
    } catch (apiError: any) {
      console.error('Server API hatası:', apiError);
      console.error('Hata detayları:', apiError.response ? JSON.stringify(apiError.response.data).substring(0, 200) : 'Yanıt detayları yok');
      // Hata durumunda yedek cevap üret
      return generateFallbackResponse(question);
    }
  } catch (error) {
    // Hata detaylarını logla
    console.error('AI işleme hatası:', error);
    
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

// Doğrudan fonksiyonları dışa aktar
export const getResponse = getAIResponse;
export { getAlternativeResponse };
// Geriye dönük uyumluluk için aiModels nesnesini de dışa aktar
export default aiModels;
