"use client";

import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaQuoteLeft, FaQuoteRight, FaCopy, FaCheck } from 'react-icons/fa';
import { likeQuestion } from '@/services/supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface AnswerDisplayProps {
  question: string;
  answer: string;
  isLoading: boolean;
}

const AnswerDisplay = ({ question, answer, isLoading }: AnswerDisplayProps) => {
  const [liked, setLiked] = useState(false);
  const [questionId, setQuestionId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  if (!question && !answer && !isLoading) {
    return null;
  }

  const handleLike = async () => {
    if (liked) return; // Zaten beğenilmiş
    
    try {
      // Normalde backend'den gelen soru ID'si kullanılır
      // Burada örnek olarak rastgele bir ID oluşturuyoruz
      const tempId = questionId || crypto.randomUUID();
      setQuestionId(tempId);
      
      await likeQuestion(tempId);
      setLiked(true);
      toast.success('Cevap beğenildi, teşekkürler!');
    } catch (error) {
      console.error('Beğeni işlemi sırasında hata:', error);
      toast.error('Beğeni işlemi sırasında bir hata oluştu.');
    }
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = `Soru: ${question}\n\nCevap: ${answer}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Cevap panoya kopyalandı!');
      
      // 2 saniye sonra kopyalama ikonunu sıfırla
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast.error('Kopyalama işlemi başarısız oldu.');
    }
  };

  return (
    <div className="card p-8 transition-all duration-300">
      {question && (
        <div className="mb-6">
          <div className="flex items-start mb-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3 mt-1">
              <FaQuoteLeft className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Soru</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg pl-10">{question}</p>
        </div>
      )}

      <div>
        <div className="flex items-start mb-3">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full mr-3 mt-1">
            <FaQuoteRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Cevap</h3>
        </div>
        
        {isLoading ? (
          <div className="pl-10">
            <div className="animate-pulse space-y-4 py-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-1 prose prose-emerald dark:prose-invert prose-a:text-emerald-600 dark:prose-a:text-emerald-400 max-w-none pl-10">
              {answer.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300 text-lg mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {answer && (
              <div className="mt-8 flex justify-end items-center space-x-4">
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {copied ? (
                    <FaCheck className="text-green-500 dark:text-green-400" />
                  ) : (
                    <FaCopy />
                  )}
                  <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                </button>
                
                <button 
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-colors ${
                    liked 
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 dark:hover:text-red-300'
                  }`}
                >
                  {liked ? (
                    <FaHeart className="text-red-500 dark:text-red-300" />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{liked ? 'Beğenildi' : 'Beğen'}</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnswerDisplay;
