"use client";

import React, { useState } from 'react';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface QuizQuestionProps {
  question: Question;
}

export default function QuizQuestion({ question }: QuizQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    setIsCorrect(option === question.correctAnswer);
  };

  return (
    <div className="p-4 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <h3 className="font-medium text-gray-800 dark:text-gray-100">
        {question.questionText}
      </h3>
      <div className="mt-3 space-y-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(option)}
            className={`w-full p-2 border dark:border-black rounded-md text-gray-800 dark:text-gray-100 ${
              selectedOption === option
                ? isCorrect
                  ? 'bg-green-200 dark:bg-green-700'
                  : 'bg-red-200 dark:bg-red-700'
                : 'bg-white dark:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
