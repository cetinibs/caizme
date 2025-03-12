import Link from 'next/link';
import { Suspense } from 'react';

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Sayfa Bulunamadı</h1>
      <p className="text-lg mb-8">Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.</p>
      <Link 
        href="/"
        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Yükleniyor...</h1>
          <p className="text-gray-600">Lütfen bekleyin.</p>
        </div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
}
