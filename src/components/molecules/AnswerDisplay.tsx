"use client";

import { useState, useEffect } from "react";
import { FiCopy, FiThumbsUp } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { likeQuestion } from "@/services/supabase";
import { motion } from "framer-motion";
import Button from "../atoms/Button";

interface AnswerDisplayProps {
  question: string;
  answer: string;
  isLoading: boolean;
}

const AnswerDisplay = ({ question, answer, isLoading }: AnswerDisplayProps) => {
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // Sayfa yüklendiğinde daha önce beğenilen soruları kontrol et
  useEffect(() => {
    if (question) {
      try {
        const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '[]');
        setLiked(likedQuestions.includes(question));
      } catch (error) {
        console.error("Beğenilen sorular kontrol edilirken hata oluştu:", error);
      }
    }
  }, [question]);

  // Cevap veya yükleme durumu değiştiğinde gösterimi güncelle
  useEffect(() => {
    if (answer || isLoading) {
      setShowAnswer(true);
    }
  }, [answer, isLoading]);

  const handleLike = async () => {
    if (!question || liked || isLiking) return;
    
    try {
      setIsLiking(true);
      
      // Soruyu beğen
      const success = await likeQuestion(question);
      
      if (success) {
        setLiked(true);
        toast.success("Cevap beğenildi!");
        
        // LocalStorage'e beğeniyi kaydet
        try {
          const likedQuestions = JSON.parse(localStorage.getItem('likedQuestions') || '[]');
          if (!likedQuestions.includes(question)) {
            likedQuestions.push(question);
            localStorage.setItem('likedQuestions', JSON.stringify(likedQuestions));
          }
        } catch (error) {
          console.error("Beğeni localStorage'e kaydedilirken hata oluştu:", error);
        }
      } else {
        toast.error("Beğeni işlemi başarısız oldu.");
      }
    } catch (error) {
      console.error("Beğeni işlemi sırasında hata oluştu:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!answer) return;
    
    try {
      navigator.clipboard.writeText(answer);
      toast.success("Cevap panoya kopyalandı!");
    } catch (error) {
      console.error("Kopyalama işlemi sırasında hata oluştu:", error);
      toast.error("Kopyalama işlemi başarısız oldu.");
    }
  };

  if (!showAnswer) return null;

  return (
    <motion.section 
      className="card p-8 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Cevap</h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center py-8">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cevap hazırlanıyor...</p>
        </div>
      ) : answer ? (
        <div>
          <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Sorunuz:</h3>
            <p className="text-gray-600 dark:text-gray-400">{question}</p>
          </div>
          
          <div className="prose dark:prose-invert max-w-none">
            {answer.split('\n').map((paragraph, index) => (
              paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
            ))}
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <Button
              variant="ghost"
              size="sm"
              icon={<FiThumbsUp className={liked ? "text-emerald-500" : ""} />}
              onClick={handleLike}
              disabled={liked || isLiking}
              isLoading={isLiking}
            >
              {liked ? "Beğenildi" : "Beğen"}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon={<FiCopy />}
              onClick={handleCopyToClipboard}
            >
              Kopyala
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 py-4">
          Henüz bir cevap yok. Lütfen bir soru sorun.
        </p>
      )}
    </motion.section>
  );
};

export default AnswerDisplay;
