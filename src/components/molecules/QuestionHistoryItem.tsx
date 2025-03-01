import React from 'react';
import { Question } from '@/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface QuestionHistoryItemProps {
  question: Question;
  onClick: (question: Question) => void;
}

const QuestionHistoryItem = ({ question, onClick }: QuestionHistoryItemProps) => {
  // Format date to a readable format
  const formattedDate = format(new Date(question.created_at), 'd MMMM yyyy, HH:mm', { locale: tr });
  
  // Truncate long question text
  const truncatedQuestion = question.question.length > 50
    ? `${question.question.substring(0, 50)}...`
    : question.question;

  return (
    <button
      onClick={() => onClick(question)}
      className="w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition duration-150 ease-in-out"
    >
      <p className="font-medium text-gray-900">{truncatedQuestion}</p>
      <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
    </button>
  );
};

export default QuestionHistoryItem;
