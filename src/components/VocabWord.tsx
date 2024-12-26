// components/VocabWord.tsx

import React, { ReactNode } from 'react';

interface VocabWordProps {
  word: string;
  translation: string;
  reading?: string;
  children: ReactNode;
}

export default function VocabWord({
  word,
  translation,
  reading,
  children
}: VocabWordProps) {
  return (
    <span
      className="
        relative group 
        cursor-pointer 
        text-blue-600 
        underline 
        underline-offset-2 
        decoration-dotted
      "
    >
      {/* The visible text in the article (e.g. "fusée") */}
      {children}

      {/* Tooltip container (hidden by default; appears on hover) */}
      <span
        className="
          pointer-events-none 
          absolute left-1/2 bottom-full 
          mb-2 
          w-max 
          -translate-x-1/2 
          rounded 
          border border-gray-200 
          bg-white 
          p-2 
          text-sm 
          text-gray-800 
          opacity-0 
          shadow 
          transition-opacity 
          group-hover:opacity-100
        "
      >
        <strong>{word}</strong>
        {reading && <> ({reading})</>}
        <br />
        {translation}
      </span>
    </span>
  );
}
