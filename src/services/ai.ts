'use client';

import axios from 'axios';

// DeepSeek API için yapılandırma
const deepSeekApiUrl = 'https://api.deepseek.com/v1';
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || '';

// DeepSeek API'dan cevap almak için
async function getAIResponse(question: string): Promise<string> {
  try {
    console.log('DeepSeek API anahtarı var mı?', !!DEEPSEEK_API_KEY);
    
    // Dini sorgu için prompt formatı (Türkçe)
    const systemPrompt = `Sen dini konularda bilgi veren, Türkçe konuşan düşünceli bir asistansın. 
İslami sorulara mantıklı, tutarlı ve saygılı cevaplar vermelisin. 
Cevaplarını Türkçe dilbilgisi kurallarına uygun, akıcı ve anlaşılır bir şekilde formatla.
Eğer bir sorunun cevabını bilmiyorsan veya emin değilsen, dürüstçe bilmediğini söyle.
Cevaplarında derin düşünce ve mantık çerçevesinde açıklamalar yap.`;

    const response = await axios.post(
      `${deepSeekApiUrl}/chat/completions`,
      {
        model: "deepseek-chat",
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
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
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
      
      return response.data.choices[0].message.content.trim();
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
    
    throw error; // Hatayı daha iyi yakalamak için dışarıya at
  }
}

// Alternatif model seçeneği eklenebilir
async function getAlternativeResponse(question: string): Promise<string> {
  try {
    // Alternatif bir model kullanılabilir
    const response = await axios.post(
      `${deepSeekApiUrl}/chat/completions`,
      {
        model: "deepseek-chat",  // Farklı bir model kullanılabilir
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
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
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
