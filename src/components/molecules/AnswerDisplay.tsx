"use client";

import React from 'react';

interface AnswerDisplayProps {
  question: string;
  answer: string;
  isLoading: boolean;
}

const AnswerDisplay = ({ question, answer, isLoading }: AnswerDisplayProps) => {
  if (!question && !answer && !isLoading) {
    return null;
  }

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
          <div className="mt-1 prose prose-emerald prose-a:text-emerald-600 max-w-none">
            {answer.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 text-lg mb-3 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerDisplay;
