'use client';

import { supabase } from './supabase';

// Soru benzerliğini kontrol etmek için fonksiyon
function calculateSimilarity(question1: string, question2: string): number {
  // Küçük harfe çevir ve noktalama işaretlerini kaldır
  const normalize = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const normalizedQ1 = normalize(question1);
  const normalizedQ2 = normalize(question2);

  // Kelime setleri oluştur
  const words1 = new Set(normalizedQ1.split(' '));
  const words2 = new Set(normalizedQ2.split(' '));

  // Ortak kelimeler
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  
  // Birleşim
  const union = new Set([...words1, ...words2]);

  // Jaccard benzerlik katsayısı
  return intersection.size / union.size;
}

// Anahtar kelimeleri çıkarmak için fonksiyon
function extractKeywords(question: string): string[] {
  // Türkçe stopwords (yaygın kullanılan, anlam taşımayan kelimeler)
  const stopwords = new Set([
    'acaba', 'ama', 'aslında', 'az', 'bazı', 'belki', 'biri', 'birkaç', 'birşey', 'biz', 'bu', 'çok', 'çünkü', 
    'da', 'daha', 'de', 'defa', 'diye', 'eğer', 'en', 'gibi', 'hem', 'hep', 'hepsi', 'her', 'hiç', 'için', 
    'ile', 'ise', 'kez', 'ki', 'kim', 'mı', 'mu', 'mü', 'nasıl', 'ne', 'neden', 'nerde', 'nerede', 'nereye', 
    'niçin', 'niye', 'o', 'sanki', 'şey', 'siz', 'şu', 'tüm', 've', 'veya', 'ya', 'yani'
  ]);

  // Küçük harfe çevir ve noktalama işaretlerini kaldır
  const normalized = question
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Kelimelere ayır ve stopwords'leri filtrele
  return normalized
    .split(' ')
    .filter(word => !stopwords.has(word) && word.length > 2);
}

// Önceden tanımlanmış cevapları kontrol etme fonksiyonu
export async function checkPredefinedAnswer(question: string): Promise<string | null> {
  try {
    // Sorudan anahtar kelimeleri çıkar
    const keywords = extractKeywords(question);
    
    if (keywords.length === 0) {
      return null;
    }

    console.log('Çıkarılan anahtar kelimeler:', keywords);

    // Anahtar kelimelere göre veritabanında ara
    const { data: keywordMatches, error: keywordError } = await supabase
      .from('predefined_answers')
      .select('*')
      .overlaps('keywords', keywords);

    if (keywordError) {
      console.error('Anahtar kelime araması hatası:', keywordError);
      return null;
    }

    console.log('Anahtar kelime eşleşmeleri:', keywordMatches?.length || 0);

    // Eşleşme yoksa null döndür
    if (!keywordMatches || keywordMatches.length === 0) {
      return null;
    }

    // Benzerlik skorlarını hesapla
    const matchesWithScores = keywordMatches.map(match => ({
      ...match,
      similarityScore: calculateSimilarity(question, match.question)
    }));

    // Benzerlik skoruna göre sırala (en yüksekten en düşüğe)
    matchesWithScores.sort((a, b) => b.similarityScore - a.similarityScore);

    // En yüksek benzerlik skoruna sahip eşleşme
    const bestMatch = matchesWithScores[0];

    // Benzerlik skoru eşik değerinden yüksekse cevabı döndür
    // 0.3 değeri ayarlanabilir, daha yüksek değer daha kesin eşleşmeler gerektirir
    if (bestMatch.similarityScore >= 0.3) {
      console.log('Eşleşen soru bulundu:', bestMatch.question);
      console.log('Benzerlik skoru:', bestMatch.similarityScore);
      return bestMatch.answer;
    }

    // Yeterli benzerlik yoksa null döndür
    return null;
  } catch (error) {
    console.error('Önceden tanımlanmış cevap kontrolü hatası:', error);
    return null;
  }
}

// Tüm önceden tanımlanmış cevapları getirme fonksiyonu (admin paneli için)
export async function getAllPredefinedAnswers() {
  try {
    const { data, error } = await supabase
      .from('predefined_answers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Önceden tanımlanmış cevapları getirme hatası:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Önceden tanımlanmış cevapları getirme hatası:', error);
    return [];
  }
}

// Yeni önceden tanımlanmış cevap ekleme fonksiyonu (admin paneli için)
export async function addPredefinedAnswer(question: string, answer: string, keywords: string[]) {
  try {
    const { data, error } = await supabase
      .from('predefined_answers')
      .insert([
        {
          question,
          answer,
          keywords,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Önceden tanımlanmış cevap ekleme hatası:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Önceden tanımlanmış cevap ekleme hatası:', error);
    return false;
  }
}

// Önceden tanımlanmış cevabı güncelleme fonksiyonu (admin paneli için)
export async function updatePredefinedAnswer(id: string, question: string, answer: string, keywords: string[]) {
  try {
    const { data, error } = await supabase
      .from('predefined_answers')
      .update({
        question,
        answer,
        keywords,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Önceden tanımlanmış cevap güncelleme hatası:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Önceden tanımlanmış cevap güncelleme hatası:', error);
    return false;
  }
}

// Önceden tanımlanmış cevabı silme fonksiyonu (admin paneli için)
export async function deletePredefinedAnswer(id: string) {
  try {
    const { data, error } = await supabase
      .from('predefined_answers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Önceden tanımlanmış cevap silme hatası:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Önceden tanımlanmış cevap silme hatası:', error);
    return false;
  }
}
