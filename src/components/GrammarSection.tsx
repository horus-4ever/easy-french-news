"use client";

import React, { useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import GrammarPoint from '@/components/GrammarPoint';

interface Example {
  french: string;
  japanese: string;
}

interface GrammarPointData {
  title: string;
  explanation: string;
  examples: Example[];
}

interface GrammarSectionProps {
  grammarPoints: GrammarPointData[];
}

export default function GrammarSection({ grammarPoints }: GrammarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="w-full bg-white rounded-md shadow p-4 self-start">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl font-semibold text-green-400">📚 Grammaire (文法)</h2>
        <div className="text-green-800 transition-transform duration-300">
          {isOpen ? <FaChevronDown size={20} /> : <FaChevronRight size={20} />}
        </div>
      </div>

      <div
        className={`transition-all duration-1000 ${
          isOpen ? 'max-h-[1000px]' : 'max-h-0 overflow-hidden'
        }`}
      >
        <div className="space-y-6">
          {grammarPoints.length > 0 ? (
            grammarPoints.map((grammar, i) => (
              <GrammarPoint
                key={i}
                title={grammar.title}
                explanation={grammar.explanation}
                examples={grammar.examples}
              />
            ))
          ) : (
            <p className="text-gray-500">No grammar points available.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
