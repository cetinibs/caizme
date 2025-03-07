"use client";

import { useState } from 'react';
import Button from '@/components/atoms/Button';
import { FiSend, FiLoader } from 'react-icons/fi';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

const QuestionForm = ({ onSubmit, isLoading }: QuestionFormProps) => {
  const [question, setQuestion] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxLength = 500;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setQuestion(value);
      setCharCount(value.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter ile gönderme
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Karakter sayısına göre renk belirleme
  const getCountColor = () => {
    const percentage = (charCount / maxLength) * 100;
    if (percentage < 70) return 'text-gray-500 dark:text-gray-400';
    if (percentage < 90) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          className="w-full min-h-[120px] p-4 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-transparent resize-y transition-all duration-200 text-gray-800 dark:text-gray-200 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400"
          placeholder="Dini bir soru sorun... (Örn: Oruçluyken diş fırçalamak orucu bozar mı?)"
          value={question}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Sorunuzu yazın"
        />
        <div className={`absolute bottom-2 right-2 text-xs ${getCountColor()}`}>
          {charCount}/{maxLength}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400 italic">
          <span className="hidden sm:inline">İpucu: </span>Ctrl+Enter tuşları ile hızlıca gönderebilirsiniz
        </div>
        <Button
          type="submit"
          disabled={!question.trim() || isLoading}
          className={`btn-primary flex items-center space-x-2 px-6 py-3 ${
            !question.trim() ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <FiLoader className="animate-spin h-5 w-5" />
              <span>Yanıt Alınıyor...</span>
            </>
          ) : (
            <>
              <FiSend className="h-5 w-5" />
              <span>Gönder</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default QuestionForm;
