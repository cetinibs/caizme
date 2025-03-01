import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/services/supabase';

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

    // Mock cevapları kullan
    const getAnswerForQuestion = (q: string): string => {
      // Sorulara özel yanıtlar
      const specificResponses: Record<string, string> = {
        "oruçluyken diş fırçalamak orucu bozar mı": "Hayır, diş fırçalamak orucu bozmaz. Ancak diş macununun yutulmaması gerekir.",
        "kadınlar tek başına namaz kılabilir mi": "Evet, kadınlar tek başına namaz kılabilirler. İslam'da kadınların tek başına ibadet etmesine engel yoktur.",
        "zekât kimlere verilir": "Zekât; yoksullara, düşkünlere, zekât toplayan görevlilere, kalpleri İslam'a ısındırılacak olanlara, kölelere, borçlulara, Allah yolunda olanlara ve yolda kalmışlara verilebilir.",
        "namaz vakitleri nelerdir": "İslam'da günlük beş vakit namaz vardır: Sabah (Fecr), Öğle (Zuhr), İkindi (Asr), Akşam (Mağrib) ve Yatsı (İşa).",
        "abdest nasıl alınır": "Abdest şu adımlarla alınır: Niyet, elleri yıkama, ağzı çalkalama, burna su çekme, yüzü yıkama, kolları dirseklere kadar yıkama, başı mesh etme, kulakları mesh etme ve ayakları topuklara kadar yıkama.",
        "kurban bayramında neler yapılır": "Kurban Bayramı'nda kurban kesme ibadeti yerine getirilir, bayram namazı kılınır, aile ve arkadaşlar ziyaret edilir, yoksullara yardım edilir ve bayram kutlamaları yapılır.",
        "ramazan bayramı": "Ramazan Bayramı, Ramazan ayının sonunda üç gün süren bir İslami bayramdır. Bayram namazıyla başlar, aile ziyaretleri yapılır, çocuklara hediyeler ve harçlıklar verilir.",
        "peygamberimiz kimdir": "İslam'ın peygamberi Hz. Muhammed'dir (s.a.v.). 570 yılında Mekke'de doğmuş, 632 yılında Medine'de vefat etmiştir. İslam'ın kutsal kitabı Kur'an-ı Kerim'i insanlara tebliğ etmiştir.",
        "cennet nedir": "Cennet, İslam inancına göre Allah'ın müminler için hazırladığı, içinde ebedi olarak kalacakları güzel bir mekândır. Burada hiçbir sıkıntı, üzüntü ve eksiklik olmayacaktır.",
        "cehennem nedir": "Cehennem, İslam inancına göre Allah'ın emirlerine karşı gelen ve kötülük yapanlar için hazırlanmış ceza yeridir. Burada günahkârlar günahlarının karşılığını görecektir.",
        "namaz nasıl kılınır": "Namaz kılmak için önce abdest alınır, kıbleye dönülür ve niyet edilir. Ardından tekbir getirilir ve sırasıyla kıyam, rükû, secde gibi rükünler yerine getirilir. Her namazın rekât sayısı ve içeriği farklıdır.",
        "oruç nedir": "Oruç, İslam'ın beş şartından biridir ve Ramazan ayında imsak vaktinden iftar vaktine kadar yeme, içme ve cinsel ilişkiden uzak durmaktır. Ayrıca ruhsal olarak da kötü düşünce ve davranışlardan uzak durmayı gerektirir.",
        "hac nedir": "Hac, İslam'ın beş şartından biridir ve belirli bir zaman diliminde Mekke'ye gidip belirli ibadetleri yerine getirmektir. Kâbe'yi tavaf etmek, Arafat'ta vakfe yapmak, şeytan taşlamak gibi ritüeller içerir.",
        "zekat nedir": "Zekât, İslam'ın beş şartından biridir ve belirli bir zenginlik seviyesine ulaşan Müslümanların mallarının bir kısmını ihtiyaç sahiplerine vermesidir. Genellikle malın %2.5'i oranında verilir.",
        "şehadet nedir": "Şehadet, İslam'ın beş şartından ilkidir. 'Eşhedü en lâ ilâhe illallah ve eşhedü enne Muhammeden abdühû ve Rasûlüh' (Allah'tan başka ilah olmadığına ve Muhammed'in O'nun kulu ve elçisi olduğuna şahitlik ederim) demektir.",
        "tevbe nedir": "Tevbe, kişinin yaptığı günahlardan pişman olup Allah'tan af dilemesi ve bir daha aynı günahı işlememeye karar vermesidir. İslam'da tevbe kapısı her zaman açıktır.",
        "kuran nedir": "Kur'an-ı Kerim, İslam'ın kutsal kitabıdır. Allah tarafından Cebrail aracılığıyla Hz. Muhammed'e vahyedilmiştir. 114 sure ve yaklaşık 6236 ayetten oluşur.",
        "salavat nedir": "Salavat, Hz. Muhammed'e olan sevgi ve saygıyı ifade etmek için söylenen dualardır. En yaygın salavat 'Allahümme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed'dir."
      };

      console.log('Gelen soru:', q);
      
      // Sorguyu normalize et (küçük harf, noktalama işaretleri kaldır)
      const normalizedQuery = q.toLowerCase().replace(/[.,?!]/g, '').trim();
      console.log('Normalize edilmiş soru:', normalizedQuery);
      
      // Tam eşleşme kontrolü
      if (specificResponses[normalizedQuery]) {
        console.log('Tam eşleşme bulundu');
        return specificResponses[normalizedQuery];
      }
      
      // Anahtar kelimeler çıkar
      const keywords = normalizedQuery.split(' ').filter(word => word.length > 2);
      console.log('Anahtar kelimeler:', keywords);
      
      // Her anahtar sözcük için puan vererek en iyi eşleşen soruyu bul
      let bestMatch = '';
      let highestScore = 0;
      
      Object.keys(specificResponses).forEach(key => {
        const normalizedKey = key.toLowerCase();
        let score = 0;
        
        // Tam dizge içinde var mı kontrolü
        if (normalizedKey.includes(normalizedQuery) || normalizedQuery.includes(normalizedKey)) {
          score += 5;
        }
        
        // Anahtar kelime eşleşme kontrolü
        keywords.forEach(word => {
          if (normalizedKey.includes(word)) {
            score += 1;
          }
        });
        
        if (score > highestScore) {
          highestScore = score;
          bestMatch = key;
        }
      });
      
      console.log('En iyi eşleşme:', bestMatch, 'Puan:', highestScore);
      
      // Yeterli puan varsa cevap döndür (eşik değeri 2)
      if (highestScore >= 2) {
        return specificResponses[bestMatch];
      }
      
      // Varsayılan yanıt
      return "Bu soruya şu anda yanıt veremiyorum. Lütfen farklı bir soru sorunuz veya sorunuzu daha açık bir şekilde ifade ediniz.";
    };

    // Soruya cevap oluştur
    const answer = getAnswerForQuestion(question);
    
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
}
