"use client";

import { useState, useEffect } from "react";
import QuestionForm from "@/components/molecules/QuestionForm";
import AnswerDisplay from "@/components/molecules/AnswerDisplay";
import StatisticsBar from "@/components/molecules/StatisticsBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { askQuestion } from "@/services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
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
        await saveQuestion(user.id, question, answer);
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
          <span className="text-emerald-600 dark:text-emerald-500">Caiz</span> mi?
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

      {(currentQuestion || currentAnswer || isLoading) && (
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <AnswerDisplay 
            question={currentQuestion} 
            answer={currentAnswer} 
            isLoading={isLoading} 
          />
        </div>
      )}

      {/* Bilgi bölümü */}
      <section className="mt-16 grid md:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: "0.5s" }}>
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
              <FiHelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Nasıl Çalışır?</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Caiz mi? platformu, İslami konularda sorularınızı yanıtlamak için gelişmiş yapay zeka teknolojisini kullanır. 
            Sorunuzu yazın ve anında cevap alın.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Cevaplar, güvenilir İslami kaynaklardan elde edilen bilgilerle oluşturulur ve farklı mezheplerin görüşlerini içerebilir.
          </p>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Sık Sorulan Sorular</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-gray-600 dark:text-gray-400">• Hangi mezheplerin görüşlerini içerir?</li>
            <li className="text-gray-600 dark:text-gray-400">• Verilen cevaplar ne kadar güvenilir?</li>
            <li className="text-gray-600 dark:text-gray-400">• Hesap oluşturmam gerekli mi?</li>
            <li className="text-gray-600 dark:text-gray-400">• Sorularım kaydediliyor mu?</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
