"use client";

import { useState } from "react";
import QuestionForm from "@/components/molecules/QuestionForm";
import AnswerDisplay from "@/components/molecules/AnswerDisplay";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { askQuestion } from "@/services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { saveQuestion } from "@/services/supabase";

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [currentAnswer, setCurrentAnswer] = useState("");
  
  // Üye olmayan kullanıcılar için localStorage'da soruları tut
  const [, setLocalQuestions] = useLocalStorage<
    Array<{ question: string; answer: string; timestamp: number }>
  >("caizmi-questions", []);

  const handleSubmitQuestion = async (question: string) => {
    try {
      setIsLoading(true);
      setCurrentQuestion(question);
      setCurrentAnswer("");

      const response = await askQuestion(question);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      const answer = response.data || "";
      setCurrentAnswer(answer);

      // Üye değilse localStorage'a kaydet
      if (!user) {
        setLocalQuestions((prev) => [
          { question, answer, timestamp: Date.now() },
          ...prev.slice(0, 9), // Son 10 soruyu tut
        ]);
      } else {
        // Üye ise veritabanına kaydet
        try {
          await saveQuestion(user.id, question, answer);
        } catch (error) {
          console.error("Soru kaydedilirken hata oluştu:", error);
          // Veritabanı hatası kullanıcıya gösterilmez, sadece loglama yapılır
        }
      }
    } catch (error) {
      console.error("Soru işleme hatası:", error);
      toast.error("Sorunuz işlenirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Caiz mi?</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Dini konulardaki sorularınızı yapay zeka destekli sistemimize sorun, 
          anında cevap alın.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-lg p-6 mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sorunuzu Sorun</h2>
        <QuestionForm onSubmit={handleSubmitQuestion} isLoading={isLoading} />
      </section>

      <AnswerDisplay 
        question={currentQuestion} 
        answer={currentAnswer} 
        isLoading={isLoading} 
      />
    </main>
  );
}
