'use client';

import axios from 'axios';

// Hugging Face Inference API için yapılandırma
const huggingFaceApiUrl = 'https://api-inference.huggingface.co/models';
const defaultModel = 'mistralai/Mistral-7B-Instruct-v0.2'; // Daha güncel ve güçlü bir model
const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY || process.env.HF_API_KEY || '';

// Hugging Face API'dan cevap almak için
async function getAIResponse(question: string, model: string = defaultModel): Promise<string> {
  try {
    console.log('HF API anahtarı var mı?', !!HF_API_KEY);
    
    // Dini sorgu için prompt formatı
    const prompt = `<s>[INST] Sen İslami konularda bilgi veren yardımcı bir asistansın. 
Aşağıdaki dini soruyu dikkatlice yanıtla. Eğer emin değilsen veya bilmiyorsan, bilmediğini açıkça belirt.

Soru: ${question} [/INST]</s>`;

    const response = await axios.post(
      `${huggingFaceApiUrl}/${encodeURIComponent(model)}`,
      { inputs: prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HF_API_KEY}`
        }
      }
    );

    console.log('API yanıtı:', response.data);

    // API'den dönen cevabı işle
    if (response.data && response.data.generated_text) {
      let answer = response.data.generated_text.trim();
      
      // Eğer yanıt, soruyu içeriyorsa (soru kısmını kaldır)
      if (answer.includes('[/INST]')) {
        answer = answer.split('[/INST]').pop() || answer;
      }
      
      // Başlangıç ve bitiş etiketlerini temizle
      answer = answer.replace(/<\/?s>/g, '').trim();
      
      return answer;
    } else if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0].generated_text || 'Üzgünüm, bu soruya cevap veremiyorum.';
    } else if (typeof response.data === 'string') {
      return response.data;
    }

    return 'Üzgünüm, bu soruya cevap veremiyorum.';
  } catch (error) {
    console.error('AI API hatası:', error);
    
    if (axios.isAxiosError(error) && error.response) {
      // API'nin döndüğü hata mesajını kontrol et
      console.error('API hata detayı:', error.response.data);
      
      // Model yüklenme durumu kontrolü (Hugging Face API'ye özgü)
      if (error.response.status === 503 && error.response.data.error?.includes('Loading')) {
        return 'Model şu anda yükleniyor. Lütfen birkaç saniye sonra tekrar deneyin.';
      }
    }
    
    throw error; // Hatayı daha iyi yakalamak için dışarıya at
  }
}

// OpenAssistant modeli ile alternatif
async function getOpenAssistantResponse(question: string): Promise<string> {
  return getAIResponse(question, 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5');
}

// Farklı modellere göre cevap seçenekleri
const aiModels = {
  DEFAULT: getAIResponse,
  OPEN_ASSISTANT: getOpenAssistantResponse,
};

export default aiModels;
