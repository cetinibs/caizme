import { Metadata } from 'next';

// Ana sayfa için metadata
export function generateHomeMetadata(): Metadata {
  return {
    title: 'Caizme - İslami Sorularınıza Uzman Yanıtlar',
    description: 'İslami sorularınızı sorun, yapay zeka destekli detaylı ve güvenilir cevaplar alın. Namaz, oruç, zekat ve diğer dini konularda bilgi edinin.',
    openGraph: {
      title: 'Caizme - İslami Sorularınıza Uzman Yanıtlar',
      description: 'İslami sorularınızı sorun, yapay zeka destekli detaylı ve güvenilir cevaplar alın. Namaz, oruç, zekat ve diğer dini konularda bilgi edinin.',
    },
  };
}

// İletişim sayfası için metadata
export function generateContactMetadata(): Metadata {
  return {
    title: 'İletişim - Caizme',
    description: 'Caizme ekibiyle iletişime geçin. Sorularınızı, önerilerinizi ve geri bildirimlerinizi bize iletebilirsiniz.',
    openGraph: {
      title: 'İletişim - Caizme',
      description: 'Caizme ekibiyle iletişime geçin. Sorularınızı, önerilerinizi ve geri bildirimlerinizi bize iletebilirsiniz.',
    },
  };
}

// Hakkımızda sayfası için metadata
export function generateAboutMetadata(): Metadata {
  return {
    title: 'Hakkımızda - Caizme',
    description: 'Caizme hakkında bilgi edinin. İslami sorularınıza yapay zeka destekli cevaplar sunan platformumuzun amacı ve vizyonu.',
    openGraph: {
      title: 'Hakkımızda - Caizme',
      description: 'Caizme hakkında bilgi edinin. İslami sorularınıza yapay zeka destekli cevaplar sunan platformumuzun amacı ve vizyonu.',
    },
  };
}

// Gizlilik sayfası için metadata
export function generatePrivacyMetadata(): Metadata {
  return {
    title: 'Gizlilik Politikası - Caizme',
    description: 'Caizme gizlilik politikası. Kişisel verilerinizin nasıl işlendiği ve korunduğu hakkında bilgi edinin.',
    openGraph: {
      title: 'Gizlilik Politikası - Caizme',
      description: 'Caizme gizlilik politikası. Kişisel verilerinizin nasıl işlendiği ve korunduğu hakkında bilgi edinin.',
    },
  };
}
