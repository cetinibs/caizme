"use client";

import ContactForm from "@/components/molecules/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bizimle İletişime Geçin</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Sorularınız, önerileriniz veya geri bildirimleriniz için aşağıdaki formu doldurarak 
          bizimle iletişime geçebilirsiniz.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-8">
        <ContactForm />
      </div>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Diğer İletişim Yolları</h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">E-posta:</span> iletisim@caizmi.com
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Sosyal Medya:</span> @caizmi
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">S.S.S.</h2>
          <div className="space-y-3">
            <p className="text-gray-600">
              <span className="font-medium">Yanıtlar ne kadar güvenilir?</span><br />
              Yanıtlar yapay zeka tarafından üretilmektedir ve yalnızca bilgilendirme amaçlıdır. 
              Dini konularda kesin kararlar için lütfen uzman görüşüne başvurun.
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Üye olmadan kullanabilir miyim?</span><br />
              Evet, üye olmadan da sorularınızı sorabilirsiniz. Ancak soru geçmişinize erişmek 
              için üye olmanız gerekir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
