"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Question } from "@/types";
import { getUserQuestions, deleteAllUserQuestions } from "@/services/supabase";
import QuestionHistoryItem from "@/components/molecules/QuestionHistoryItem";
import Button from "@/components/atoms/Button";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  useEffect(() => {
    // Kullanıcı yükleniyor değilse ve kullanıcı yoksa, ana sayfaya yönlendir
    if (!loading && !user) {
      router.push("/");
      return;
    }

    // Kullanıcı varsa, sorguları yükle
    const loadQuestions = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await getUserQuestions(user.id);
        setQuestions(data || []);
      } catch (error) {
        console.error("Soru geçmişi yüklenirken hata:", error);
        toast.error("Soru geçmişiniz yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadQuestions();
    }
  }, [user, loading, router]);

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
  };

  const handleDeleteAllQuestions = async () => {
    if (!user || !confirm("Tüm soru geçmişinizi silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      setIsDeletingAll(true);
      await deleteAllUserQuestions(user.id);
      setQuestions([]);
      setSelectedQuestion(null);
      toast.success("Tüm soru geçmişiniz başarıyla silindi.");
    } catch (error) {
      console.error("Sorular silinirken hata:", error);
      toast.error("Soru geçmişiniz silinirken bir hata oluştu.");
    } finally {
      setIsDeletingAll(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profiliniz</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Kullanıcı Bilgileri</h2>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">E-posta:</span> {user.email}
          </p>
          {user.user_metadata?.full_name && (
            <p className="text-gray-600">
              <span className="font-medium">İsim:</span> {user.user_metadata.full_name}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Soru Geçmişiniz</h2>
            {questions.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                icon={<FiTrash2 />}
                iconPosition="left"
                onClick={handleDeleteAllQuestions}
                isLoading={isDeletingAll}
                disabled={isDeletingAll}
              >
                Tümünü Sil
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="space-y-3 py-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Henüz soru sormadınız.</p>
          ) : (
            <div className="overflow-y-auto max-h-[500px]">
              {questions.map((question) => (
                <QuestionHistoryItem
                  key={question.id}
                  question={question}
                  onClick={handleQuestionClick}
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedQuestion ? "Seçilen Soru ve Cevap" : "Detaylar"}
          </h2>
          
          {selectedQuestion ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Soru:</h3>
                <p className="text-gray-600 mt-1">{selectedQuestion.question}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700">Cevap:</h3>
                <div className="mt-1 text-gray-600 prose prose-emerald max-w-none">
                  {selectedQuestion.answer.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Sol menüden bir soru seçerek detayları görüntüleyebilirsiniz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
