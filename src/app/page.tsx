"use client";

import { useState, useEffect } from "react";
import QuestionForm from "@/components/molecules/QuestionForm";
import AnswerDisplay from "@/components/molecules/AnswerDisplay";
import StatisticsBar from "@/components/molecules/StatisticsBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { askQuestion } from "@/services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/components/providers/AuthProvider";
import { saveQuestion, incrementVisitorCount } from "@/services/supabase";
import { FiHelpCircle, FiMessageSquare } from "react-icons/fi";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  const { user } = useAuth();
  const [recentQuestions, setRecentQuestions] = useLocalStorage<string[]>("recentQuestions", []);
  const [visitorCounted, setVisitorCounted] = useLocalStorage<boolean>("visitorCounted", false);

  // Sayfa yüklendiğinde ziyaretçi sayısını artır
  useEffect(() => {
    const incrementVisitor = async () => {
      // Kullanıcı daha önce sayılmışsa tekrar sayma
      if (visitorCounted) return;
      
      try {
        await incrementVisitorCount();
        // Başarılı olursa, kullanıcıyı sayılmış olarak işaretle
        setVisitorCounted(true);
      } catch (error) {
        console.error("Ziyaretçi sayısı artırılırken hata oluştu:", error);
        // Hata durumunda 1 saat sonra tekrar deneyebilmek için
        setTimeout(() => setVisitorCounted(false), 3600000);
      }
    };

    incrementVisitor();
  }, [visitorCounted, setVisitorCounted]);

  const handleSubmitQuestion = async (question: string) => {
    try {
      setIsLoading(true);
      setCurrentQuestion(question);
      setCurrentAnswer("");

      // Soruyu API'ye gönder
      const response = await askQuestion(question);
      
      if (response.error) {
        toast.error(response.error);
        setIsLoading(false);
        return;
      }
      
      const answer = response.data || "";
      setCurrentAnswer(answer);

      // Soruyu kaydet (üye ise Supabase'e, değilse localStorage'a)
      if (user) {
        try {
          await saveQuestion(user.id, question, answer);
        } catch (error) {
          console.error("Soru kaydedilirken hata oluştu:", error);
          // Hata durumunda kullanıcıyı rahatsız etme, sessizce devam et
        }
      } else {
        // Son 5 soruyu localStorage'da sakla
        const updatedQuestions = [question, ...recentQuestions.slice(0, 4)];
        setRecentQuestions(updatedQuestions);
      }
    } catch (error) {
      console.error("Soru sorulurken hata oluştu:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container-custom py-12">
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in">
          <span className="text-emerald-600 dark:text-emerald-500">Caiz</span>.me
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Dini konulardaki sorularınızı yapay zeka destekli sistemimize sorun, 
          anında cevap alın.
        </p>
      </section>

      {/* İstatistik çubuğu */}
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <StatisticsBar />
      </div>

      <section className="card p-8 mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-center mb-6">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mr-4">
            <FiMessageSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Sorunuzu Sorun</h2>
        </div>
        <QuestionForm onSubmit={handleSubmitQuestion} isLoading={isLoading} />
      </section>

      {/* Cevap Gösterimi */}
      <AnswerDisplay 
        question={currentQuestion} 
        answer={currentAnswer} 
        isLoading={isLoading} 
      />

      {/* Bilgi Kartı */}
      <section className="card p-8 mt-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="flex items-start">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4 mt-1">
            <FiHelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Caiz.me Hakkında</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                Caiz.me, İslami sorularınıza hızlı ve güvenilir cevaplar sunan yapay zeka destekli bir platformdur. 
                Namaz, oruç, zekat gibi ibadetler hakkındaki sorularınızı sorabilir, farklı mezheplerin görüşlerini öğrenebilirsiniz.
              </p>
              <p>
                Sistemimiz, güvenilir İslami kaynaklardan beslenen yapay zeka modelleri kullanarak sorularınıza kapsamlı yanıtlar üretir. 
                Cevaplar, farklı görüşleri ve delilleri içerecek şekilde yapılandırılmıştır.
              </p>
              <p>
                <strong>Not:</strong> Caiz.me bir fetva makamı değildir. Önemli dini konularda mutlaka bir din aliminden görüş alınız.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
