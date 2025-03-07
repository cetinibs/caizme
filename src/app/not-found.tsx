import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Sayfa Bulunamadı</h1>
      <p className="text-lg mb-8">Aradığınız sayfa mevcut değil.</p>
      <Link href="/" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
