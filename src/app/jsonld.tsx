'use client';

import Script from 'next/script';

export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Caizme",
    "url": "https://caizme.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://caizme.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "İslami sorularınızı sorun, yapay zeka destekli detaylı ve güvenilir cevaplar alın.",
    "inLanguage": "tr-TR",
    "publisher": {
      "@type": "Organization",
      "name": "Caizme",
      "logo": {
        "@type": "ImageObject",
        "url": "https://caizme.com/logo.png"
      }
    }
  };

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
