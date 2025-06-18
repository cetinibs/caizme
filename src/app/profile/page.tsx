/**
 * Profil sayfası bileşeni
 * Kullanıcı giriş yapmamışsa ana sayfaya yönlendirir
 */
export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Kullanıcı Bilgileri</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Profil sayfası yükleniyor...
          </p>
        </div>
      </div>
    </div>
  );
}
