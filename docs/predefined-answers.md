# Önceden Tanımlanmış Cevaplar Sistemi

Bu belge, Caiz.me platformunda önceden tanımlanmış cevaplar sisteminin nasıl çalıştığını ve nasıl kullanılacağını açıklar.

## Genel Bakış

Önceden tanımlanmış cevaplar sistemi, sık sorulan sorulara hızlı ve tutarlı cevaplar vermek için tasarlanmıştır. Bu sistem, kullanıcının sorusunu yapay zekaya göndermeden önce veritabanında benzer bir soru olup olmadığını kontrol eder. Eğer benzer bir soru bulunursa, önceden hazırlanmış cevap kullanıcıya gösterilir. Bu sayede:

1. Yapay zeka API maliyetleri azaltılır
2. Cevap verme süresi kısalır
3. Sık sorulan sorulara tutarlı ve doğru cevaplar verilir
4. Hassas konularda kontrollü cevaplar sağlanır

## Sistem Bileşenleri

Sistem aşağıdaki bileşenlerden oluşur:

1. **Veritabanı Tablosu**: `predefined_answers` tablosu, önceden tanımlanmış soruları, cevapları ve anahtar kelimeleri saklar.
2. **Soru İşleme Servisi**: `predefinedAnswers.ts` servisi, kullanıcı sorusunu analiz eder ve veritabanında benzer sorular arar.
3. **API Entegrasyonu**: API rotası, önce önceden tanımlanmış cevapları kontrol eder, bulamazsa yapay zekaya sorar.
4. **Admin Arayüzü**: Önceden tanımlanmış cevapları yönetmek için bir admin arayüzü.

## Veritabanı Yapısı

`predefined_answers` tablosu aşağıdaki alanları içerir:

- `id`: Benzersiz tanımlayıcı (UUID)
- `question`: Önceden tanımlanmış soru metni
- `answer`: Önceden hazırlanmış cevap metni (markdown formatında)
- `keywords`: Soru ile ilişkili anahtar kelimeler dizisi
- `created_at`: Oluşturulma tarihi
- `updated_at`: Son güncelleme tarihi

## Soru Eşleştirme Algoritması

Sistem, kullanıcı sorusunu önceden tanımlanmış sorularla eşleştirmek için iki aşamalı bir algoritma kullanır:

1. **Anahtar Kelime Eşleştirme**: Kullanıcı sorusundan anahtar kelimeler çıkarılır ve veritabanındaki anahtar kelimelerle eşleştirilir.
2. **Benzerlik Skoru Hesaplama**: Anahtar kelime eşleşmesi bulunan sorular için Jaccard benzerlik katsayısı hesaplanır.

Benzerlik skoru belirli bir eşik değerinin (0.3) üzerindeyse, önceden tanımlanmış cevap kullanılır.

## Admin Arayüzü Kullanımı

Admin arayüzüne `/admin/predefined-answers` adresinden erişilebilir. Bu arayüz aşağıdaki işlemleri yapmanıza olanak tanır:

1. **Cevapları Görüntüleme**: Tüm önceden tanımlanmış cevapları listeler.
2. **Yeni Cevap Ekleme**: "Yeni Ekle" butonuna tıklayarak yeni bir soru ve cevap ekleyebilirsiniz.
3. **Cevap Düzenleme**: Mevcut bir cevabı düzenlemek için düzenleme simgesine tıklayabilirsiniz.
4. **Cevap Silme**: Bir cevabı silmek için silme simgesine tıklayabilirsiniz.

### Yeni Cevap Eklerken Dikkat Edilecek Hususlar

1. **Soru**: Kullanıcıların sorabileceği bir soru formatında yazın.
2. **Cevap**: Markdown formatında detaylı bir cevap yazın. Cevap, Caiz.me'nin standart formatını takip etmelidir:
   - **Sorunun Özeti**
   - **Dini Hüküm**
   - **Farklı Görüşler**
   - **Deliller**
   - **Günlük Uygulama**
   - **Sonuç**
3. **Anahtar Kelimeler**: Soruyla ilgili anahtar kelimeleri virgülle ayırarak girin. Bu anahtar kelimeler, kullanıcı sorularını eşleştirmek için kullanılacaktır.

## Cevap Kaynağı Gösterimi

Kullanıcı arayüzünde, cevabın kaynağı (önceden tanımlanmış, yapay zeka veya yedek) gösterilir. Bu, kullanıcılara cevabın nereden geldiği konusunda şeffaflık sağlar.

## Önerilen Kullanım

1. Sık sorulan sorular için önceden tanımlanmış cevaplar ekleyin.
2. Hassas konular için özel hazırlanmış cevaplar oluşturun.
3. Anahtar kelimeleri dikkatli seçin, çok genel veya çok spesifik olmamasına dikkat edin.
4. Cevapları düzenli olarak güncelleyin ve iyileştirin.

## Teknik Detaylar

- Benzerlik skoru eşik değeri `predefinedAnswers.ts` dosyasında `0.3` olarak ayarlanmıştır. Bu değer, daha kesin eşleşmeler için artırılabilir veya daha geniş eşleşmeler için azaltılabilir.
- Anahtar kelime çıkarma işlemi, Türkçe stopwords (yaygın kullanılan, anlam taşımayan kelimeler) listesi kullanılarak yapılır.
- Cevaplar markdown formatında saklanır ve frontend tarafında render edilir.
