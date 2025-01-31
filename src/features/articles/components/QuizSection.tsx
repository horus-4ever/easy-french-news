"use client";

import React, { useState } from 'react';
import QuizQuestion from '@/features/articles/components/QuizQuestion';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

interface Question {
  id: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface QuizSectionProps {
  questions: Question[];
}

export default function QuizSection({ questions }: QuizSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow p-4 mt-2">
      <button
        className="w-full text-left font-bold text-lg flex justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-green-400 dark:text-green-500 text-2xl font-semibold">📝 Quiz</h2>
        <div className="text-green-800 dark:text-green-400 transition-transform duration-300">
            {isOpen ? <FaChevronDown size={20} /> : <FaChevronRight size={20} />}
        </div>
      </button>
      <div
        className={`transition-all duration-1000 ${
          isOpen ? 'max-h-[1000px]' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="mt-4 space-y-4">
          {questions.map((q, idx) => (
            <QuizQuestion key={idx} question={q} />
          ))}
        </div>
      </div>
    </section>
  );
}
