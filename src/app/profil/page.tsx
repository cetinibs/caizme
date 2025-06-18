"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { getUserQuestions } from "@/services/supabase";
import { FiUser, FiMessageSquare, FiCalendar, FiClock } from "react-icons/fi";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  likes_count?: number;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa ana sayfaya yönlendir
    if (!authLoading && !user) {
      router.push("/");
      return;
    }

    // Kullanıcı giriş yapmışsa sorularını getir
    const fetchQuestions = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const userQuestions = await getUserQuestions(user.id);
          setQuestions(userQuestions);
        } catch (error) {
          console.error("Sorular alınırken hata oluştu:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (user) {
      fetchQuestions();
    }
  }, [user, authLoading, router]);

  // Tarih formatını düzenle
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Saat formatını düzenle
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Cevabı kısalt
  const truncateAnswer = (answer: string, maxLength: number = 150) => {
    if (answer.length <= maxLength) return answer;
    return answer.substring(0, maxLength) + "...";
  };

  if (authLoading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router zaten yönlendirme yapacak
  }

  return (
    <div className="container-custom py-12">
      <div className="card p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mr-4">
            <FiUser className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold">Profilim</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Kullanıcı Bilgileri</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="mb-2">
                <span className="font-medium">E-posta:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Üyelik Tarihi:</span>{" "}
                {user.created_at
                  ? formatDate(user.created_at)
                  : "Bilgi bulunamadı"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">İstatistikler</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="mb-2">
                <span className="font-medium">Toplam Soru:</span>{" "}
                {questions.length}
              </p>
              <p>
                <span className="font-medium">Son Soru Tarihi:</span>{" "}
                {questions.length > 0
                  ? formatDate(questions[0].created_at)
                  : "Henüz soru sormadınız"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
            <FiMessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold">Sorduğum Sorular</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Henüz soru sormadınız.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Soru Sor
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {questions.map((question) => (
              <div
                key={question.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    {question.question}
                  </h3>

                  <div className="prose dark:prose-invert max-w-none mb-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                      {truncateAnswer(question.answer)
                        .split("\n")
                        .map((paragraph, index) =>
                          paragraph.trim() ? (
                            <p key={index} className="mb-2">
                              {paragraph}
                            </p>
                          ) : (
                            <br key={index} />
                          )
                        )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    <div className="flex items-center mr-4 mb-2">
                      <FiCalendar className="mr-1" />
                      <span>{formatDate(question.created_at)}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <FiClock className="mr-1" />
                      <span>{formatTime(question.created_at)}</span>
                    </div>
                    {question.likes_count !== undefined && question.likes_count > 0 && (
                      <div className="flex items-center ml-auto mb-2">
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-1 rounded-full">
                          {question.likes_count} beğeni
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
