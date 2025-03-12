"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/**
 * Profil sayfası bileşeni
 * Kullanıcı giriş yapmamışsa ana sayfaya yönlendirir
 */
const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı yüklenmesi tamamlandıysa ve giriş yapmamışsa ana sayfaya yönlendir
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Yükleme durumunda veya kullanıcı yoksa boş içerik göster
  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Profil</h1>
      <div className="card p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Kullanıcı Bilgileri</h2>
          <p className="text-gray-600 dark:text-gray-400">
            E-posta: {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export { ProfilePage };
