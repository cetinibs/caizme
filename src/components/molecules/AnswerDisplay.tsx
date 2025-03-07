"use client";

import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
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

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      {question && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">Soru:</h3>
          <p className="mt-1 text-gray-600 text-lg">{question}</p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-900">Cevap:</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-1 prose prose-emerald prose-a:text-emerald-600 max-w-none">
              {answer.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 text-lg mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {answer && (
              <div className="mt-6 flex justify-end items-center">
                <button 
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-colors ${
                    liked 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                  }`}
                >
                  {liked ? (
                    <FaHeart className="text-red-500" />
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
