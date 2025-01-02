"use client";
import React from 'react';

interface Example {
  french: string;
  japanese: string;
}

interface GrammarPointProps {
  title: string;
  explanation: string;
  examples: Example[];
}

export default function GrammarPoint({ title, explanation, examples }: GrammarPointProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300 mt-2">{explanation}</p>
      <div className="mt-3">
        {examples.map((example, idx) => (
          <div key={idx} className="ml-4 mt-2">
            <p className="italic text-gray-800 dark:text-gray-200">FR: {example.french}</p>
            <p className="text-gray-700 dark:text-gray-300">JP: {example.japanese}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
