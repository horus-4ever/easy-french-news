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
    <div className="p-4 border rounded-md">
      <h3 className="font-medium text-gray-800">{question.questionText}</h3>
      <div className="mt-3 space-y-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(option)}
            className={`w-full p-2 border rounded-md ${
              selectedOption === option
                ? isCorrect
                  ? 'bg-green-200'
                  : 'bg-red-200'
                : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
