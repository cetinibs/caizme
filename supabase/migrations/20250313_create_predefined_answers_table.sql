-- Önceden tanımlanmış soru ve cevapları tutacak tablo
CREATE TABLE IF NOT EXISTS predefined_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Arama için GIN indeksi
CREATE INDEX IF NOT EXISTS predefined_answers_keywords_idx ON predefined_answers USING GIN (keywords);

-- Tam metin araması için indeks
CREATE INDEX IF NOT EXISTS predefined_answers_question_idx ON predefined_answers USING GIN (to_tsvector('turkish', question));

-- Örnek veri
INSERT INTO predefined_answers (question, answer, keywords) VALUES 
(
  'Kuran-ı Kerim''i hatim etmek nedir?',
  '**Sorunun Özeti**
Kuran-ı Kerim''i hatim etmek hakkında bilgi istenmiştir.

**Dini Hüküm**
Kuran-ı Kerim''i hatim etmek, Kuran''ın tamamını baştan sona okumak anlamına gelir ve bu, Müslümanlar için önemli bir ibadettir.

**Farklı Görüşler**
Tüm İslam alimleri Kuran''ı hatim etmenin faziletli bir ibadet olduğu konusunda hemfikirdir. Ancak hatim süresi konusunda farklı görüşler vardır. Bazı alimler Kuran''ı 3 günden daha kısa sürede hatmetmeyi tavsiye etmezken, diğerleri Ramazan ayında her gün bir cüz okuyarak ayda bir hatim yapılmasını önerir.

**Deliller**
Hz. Peygamber (s.a.v.) şöyle buyurmuştur: "Kim Kur''an''ı okur ve onunla amel ederse, kıyamet gününde anne babasına bir taç giydirilir. Bu tacın ışığı, güneş dünyadaki bir eve konulduğunda vereceği ışıktan daha güzeldir." (Ebu Davud)

**Günlük Uygulama**
Kuran''ı hatim etmek için düzenli bir program belirleyebilirsiniz. Örneğin, her gün bir cüz (20 sayfa) okuyarak 30 günde bir hatim tamamlanabilir. Veya günde 5 sayfa okuyarak yaklaşık 4 ayda bir hatim yapılabilir. Önemli olan düzenli ve anlayarak okumaktır.

**Sonuç**
Kuran-ı Kerim''i hatim etmek, hem dünyevi hem de uhrevi faydaları olan değerli bir ibadettir. Kuran''ı sadece okumakla kalmayıp, anlamını düşünmek ve hayata geçirmek de önemlidir.',
  ARRAY['kuran', 'hatim', 'hatim etmek', 'kuran okumak', 'kuran-ı kerim']
),
(
  'Namaz kılmanın önemi nedir?',
  '**Sorunun Özeti**
Namaz kılmanın İslam''daki önemi hakkında bilgi istenmiştir.

**Dini Hüküm**
Namaz, İslam''ın beş şartından biridir ve akıl-baliğ olan her Müslüman''a farzdır. Günde beş vakit namaz kılmak, Müslümanların en temel ibadetlerindendir.

**Farklı Görüşler**
Tüm İslam alimleri namazın farz olduğu konusunda hemfikirdir. Ancak namazın şekli, vakitleri ve detayları konusunda mezhepler arasında küçük farklılıklar bulunabilir.

**Deliller**
Kur''an-ı Kerim''de "Namazı kılın, zekatı verin ve rükû edenlerle beraber rükû edin." (Bakara Suresi, 43) buyrulmaktadır. Ayrıca Hz. Peygamber (s.a.v.) "Namaz dinin direğidir" buyurmuştur.

**Günlük Uygulama**
Namazları vaktinde ve huşu içinde kılmaya özen gösterilmelidir. Namaz, günlük hayatın stresinden uzaklaşmak ve Allah ile bağ kurmak için önemli bir fırsattır.

**Sonuç**
Namaz, Müslümanların günlük hayatını düzenleyen, disiplin kazandıran ve Allah''a yakınlaşmayı sağlayan en önemli ibadetlerden biridir.',
  ARRAY['namaz', 'namaz kılmak', 'ibadet', 'farz', 'salat']
),
(
  'Oruç tutmanın faydaları nelerdir?',
  '**Sorunun Özeti**
Oruç tutmanın dini ve sağlık açısından faydaları hakkında bilgi istenmiştir.

**Dini Hüküm**
Oruç, İslam''ın beş şartından biridir ve Ramazan ayında oruç tutmak, akıl-baliğ olan, sağlıklı her Müslüman''a farzdır.

**Farklı Görüşler**
Tüm İslam alimleri Ramazan orucunun farz olduğu konusunda hemfikirdir. Nafile oruçlar konusunda ise farklı tavsiyeler bulunabilir.

**Deliller**
Kur''an-ı Kerim''de "Ey iman edenler! Oruç sizden öncekilere farz kılındığı gibi size de farz kılındı. Umulur ki korunursunuz." (Bakara Suresi, 183) buyrulmaktadır.

**Günlük Uygulama**
Oruç, sadece yeme-içmeden uzak durmak değil, aynı zamanda kötü söz ve davranışlardan da uzak durmayı gerektirir. Oruç, sabır ve irade eğitimidir.

**Sonuç**
Oruç, hem manevi arınma hem de fiziksel sağlık için faydalı bir ibadettir. Nefsi terbiye eder, sabır ve şükür duygularını geliştirir, toplumsal dayanışmayı artırır ve sağlık açısından da vücudun yenilenmesine katkıda bulunur.',
  ARRAY['oruç', 'ramazan', 'oruç tutmak', 'farz', 'savm']
),
(
  'Zekat kimlere verilir?',
  '**Sorunun Özeti**
Zekatın kimlere verilebileceği hakkında bilgi istenmiştir.

**Dini Hüküm**
Zekat, İslam''ın beş şartından biridir ve belirli bir nisaba ulaşan malların belirli oranlarda ihtiyaç sahiplerine verilmesidir.

**Farklı Görüşler**
Tüm mezhepler zekatın Kur''an''da belirtilen sekiz sınıfa verilebileceği konusunda hemfikirdir, ancak günümüz şartlarında bu sınıfların yorumlanması konusunda farklı görüşler olabilir.

**Deliller**
Kur''an-ı Kerim''de "Sadakalar (zekatlar) Allah''tan bir farz olarak ancak, yoksullara, düşkünlere, (zekat) işinde görevli olanlara, kalpleri (İslam''a) ısındırılacak olanlara, kölelik altında bulunanlara, borçlulara, Allah yolunda olanlara ve yolda kalmışlara mahsustur." (Tevbe Suresi, 60) buyrulmaktadır.

**Günlük Uygulama**
Zekat, günümüzde genellikle yoksullara, düşkünlere, borçlulara ve İslami eğitim kurumlarına verilebilir. Zekat hesaplanırken bir İslam aliminden yardım alınabilir.

**Sonuç**
Zekat, İslam''ın sosyal adalet anlayışının bir göstergesidir ve toplumda gelir dağılımının dengelenmesine katkıda bulunur.',
  ARRAY['zekat', 'sadaka', 'infak', 'zekat vermek', 'zekat kimlere verilir']
),
(
  'Hac ibadeti nasıl yapılır?',
  '**Sorunun Özeti**
Hac ibadetinin nasıl yapıldığı hakkında bilgi istenmiştir.

**Dini Hüküm**
Hac, İslam''ın beş şartından biridir ve gücü yeten her Müslüman''ın ömründe en az bir kez yerine getirmesi gereken bir farzdır.

**Farklı Görüşler**
Tüm mezhepler haccın farz olduğu konusunda hemfikirdir, ancak hac menasikinin (ritüellerinin) detayları konusunda bazı farklılıklar olabilir.

**Deliller**
Kur''an-ı Kerim''de "Yoluna gücü yetenlerin o evi (Kabe''yi) haccetmesi, Allah''ın insanlar üzerindeki hakkıdır." (Al-i İmran Suresi, 97) buyrulmaktadır.

**Günlük Uygulama**
Hac ibadeti, Zilhicce ayının 8-13. günleri arasında yapılır ve ihrama girmek, Arafat''ta vakfe yapmak, Müzdelife''de gecelemek, şeytan taşlamak, kurban kesmek, Kabe''yi tavaf etmek ve sa''y yapmak gibi ritüelleri içerir.

**Sonuç**
Hac, Müslümanların birlik ve beraberliğini sağlayan, manevi arınmayı ve yenilenmeyi sağlayan önemli bir ibadettir.',
  ARRAY['hac', 'umre', 'kabe', 'arafat', 'tavaf', 'say']
),
(
  'Kuran-ı Kerim kaç cüzden oluşur?',
  '**Sorunun Özeti**
Kuran-ı Kerim''in kaç cüzden oluştuğu hakkında bilgi istenmiştir.

**Dini Hüküm**
Kuran-ı Kerim''in bölümlenmesi ibadet açısından kolaylık sağlamak için yapılmıştır ve dini bir hüküm içermez.

**Farklı Görüşler**
Bu konuda farklı görüş bulunmamaktadır. Kuran-ı Kerim''in 30 cüze bölünmesi konusunda İslam alimleri arasında görüş birliği vardır.

**Deliller**
Kuran-ı Kerim''in 30 cüze bölünmesi, Hz. Osman döneminde Kuran''ın çoğaltılması ve düzenlenmesi sırasında gerçekleştirilmiştir.

**Günlük Uygulama**
Kuran-ı Kerim''in 30 cüze bölünmesi, özellikle Ramazan ayında her gün bir cüz okunarak ayda bir hatim yapılmasını kolaylaştırmaktadır.

**Sonuç**
Kuran-ı Kerim 30 cüzden oluşur. Her cüz yaklaşık 20 sayfa, her sayfa 15 satırdır. Toplam 114 sure ve 6236 ayet içerir.',
  ARRAY['kuran', 'cüz', 'kuran kaç cüz', 'kuran bölümleri', 'kuran-ı kerim']
),
(
  'Kuran-ı Kerim''de kaç sure vardır?',
  '**Sorunun Özeti**
Kuran-ı Kerim''de kaç sure olduğu hakkında bilgi istenmiştir.

**Dini Hüküm**
Kuran-ı Kerim''in sure sayısı konusunda dini bir hüküm bulunmamaktadır.

**Farklı Görüşler**
Bu konuda farklı görüş bulunmamaktadır. Kuran-ı Kerim''in 114 sureden oluştuğu konusunda İslam alimleri arasında görüş birliği vardır.

**Deliller**
Kuran-ı Kerim''in 114 sureden oluşması, Hz. Osman döneminde Kuran''ın çoğaltılması ve düzenlenmesi sırasında kesinleşmiştir.

**Günlük Uygulama**
Kuran-ı Kerim''deki sureler uzunluklarına göre farklılık gösterir. En uzun sure Bakara Suresi (286 ayet), en kısa sure ise Kevser Suresi (3 ayet)''dir.

**Sonuç**
Kuran-ı Kerim 114 sureden oluşur. Bu sureler Mekki (Mekke''de inen) ve Medeni (Medine''de inen) olarak iki gruba ayrılır.',
  ARRAY['kuran', 'sure', 'kuran kaç sure', 'kuran bölümleri', 'kuran-ı kerim']
),
(
  'Kuran-ı Kerim''de kaç ayet vardır?',
  '**Sorunun Özeti**
Kuran-ı Kerim''de kaç ayet olduğu hakkında bilgi istenmiştir.

**Dini Hüküm**
Kuran-ı Kerim''in ayet sayısı konusunda dini bir hüküm bulunmamaktadır.

**Farklı Görüşler**
Kuran-ı Kerim''deki ayet sayısı konusunda küçük farklılıklar olabilir. Genel kabul gören sayı 6236 olmakla birlikte, bazı kaynaklarda 6237, 6219 veya 6214 gibi farklı sayılar da zikredilmektedir. Bu farklılık, bazı ayetlerin sayılma biçiminden kaynaklanmaktadır.

**Deliller**
Kuran-ı Kerim''in ayet sayısı, Hz. Osman döneminde Kuran''ın çoğaltılması ve düzenlenmesi sırasında belirlenmiştir.

**Günlük Uygulama**
Kuran-ı Kerim''i okurken ve ezberlerken ayetlerin başlangıç ve bitişlerine dikkat etmek önemlidir. Mushaf''larda ayetlerin sonları genellikle özel işaretlerle belirtilir.

**Sonuç**
Kuran-ı Kerim''de genel kabule göre 6236 ayet bulunmaktadır. Bu ayetler, İslam''ın temel inanç esaslarını, ibadet şekillerini, ahlaki prensiplerini ve toplumsal düzenlemelerini içerir.',
  ARRAY['kuran', 'ayet', 'kuran kaç ayet', 'kuran bölümleri', 'kuran-ı kerim']
),
(
  'Kuran-ı Kerim''i hatim etmenin sevabı nedir?',
  '**Sorunun Özeti**
Kuran-ı Kerim''i hatim etmenin sevabı hakkında bilgi istenmiştir.

**Dini Hüküm**
Kuran-ı Kerim''i okumak ve hatim etmek müstehaptır (teşvik edilmiştir) ve büyük sevap kazandıran bir ibadettir.

**Farklı Görüşler**
Tüm İslam alimleri Kuran okuma ve hatim etmenin faziletli bir ibadet olduğu konusunda hemfikirdir.

**Deliller**
Hz. Peygamber (s.a.v.) şöyle buyurmuştur: "Kim Allah''ın Kitabı''ndan bir harf okursa, onun için bir iyilik vardır. Her bir iyilik on misliyle (yazılır)." (Tirmizi)

Başka bir hadiste: "Kuran okuyan ve onunla amel eden kimsenin anne-babasına kıyamet gününde bir taç giydirilir. Bu tacın ışığı, güneşin dünya evlerinde verdiği ışıktan daha güzeldir." (Ebu Davud)

**Günlük Uygulama**
Kuran-ı Kerim''i düzenli olarak okumak ve mümkünse anlamını öğrenerek hatim etmek, Müslümanlar için önemli bir ibadettir. Özellikle Ramazan ayında hatim yapmak yaygın bir gelenektir.

**Sonuç**
Kuran-ı Kerim''i hatim etmek, Allah''ın rızasını kazanmak, manevi olarak arınmak ve ahirette büyük mükafatlara nail olmak için önemli bir vesiledir. Ancak sadece okumakla kalmayıp, anlamını düşünmek ve hayata geçirmek de önemlidir.',
  ARRAY['kuran', 'hatim', 'sevap', 'kuran okumak', 'hatim sevabı']
),
(
  'Kuran-ı Kerim''i Türkçe okumak caiz midir?',
  '**Sorunun Özeti**
Kuran-ı Kerim''i Türkçe mealiyle okumak veya ibadetlerde Türkçe okumak caiz midir sorusu sorulmuştur.

**Dini Hüküm**
Kuran-ı Kerim''i anlamak için Türkçe mealini okumak caizdir ve hatta teşvik edilir. Ancak namaz gibi ibadetlerde Kuran''ın aslı olan Arapça metnin okunması gerekir.

**Farklı Görüşler**
Tüm mezhepler, namazda Fatiha ve zamm-ı sure olarak Kuran''ın aslının (Arapça) okunması gerektiği konusunda hemfikirdir. Ancak Hanefi mezhebine göre, Arapça bilmeyen kişi öğrenene kadar namazda kendi dilinde okuyabilir. Diğer mezhepler ise namazda mutlaka Arapça okunması gerektiğini savunur.

**Deliller**
Kur''an-ı Kerim''de "Biz onu akıl erdiresiniz diye Arapça bir Kur''an olarak indirdik." (Yusuf Suresi, 2) buyrulmaktadır. Ayrıca "Şüphesiz ki bu (Kur''an), alemlerin Rabbi''nin indirmesidir. Uyarıcılardan olasın diye onu güvenilir Ruh (Cebrail) senin kalbine apaçık bir Arapça ile indirmiştir." (Şuara Suresi, 192-195) ayetleri de Kuran''ın Arapça olarak indirildiğini vurgulamaktadır.

**Günlük Uygulama**
Kuran-ı Kerim''i anlamak için Türkçe mealini okumak çok faydalıdır. İdeal olan, hem Arapça aslını okumak hem de anlamını öğrenmek için mealini okumaktır. Namazda ise Fatiha ve diğer surelerin Arapça aslını okumak gerekir.

**Sonuç**
Kuran-ı Kerim''i anlamak için Türkçe mealini okumak caizdir ve teşvik edilir. Ancak ibadetlerde, özellikle namazda Kuran''ın aslı olan Arapça metnin okunması gerekir. Kuran''ı anlamak ve hayata geçirmek için mealini okumak önemlidir.',
  ARRAY['kuran', 'türkçe', 'meal', 'türkçe kuran', 'kuran tercümesi']
);
