"use client";

import React, { useState } from 'react';
import ConjugationPopup from '@/components/conjugation/ConjugationPopup';

interface IVocabulary {
  word: string;
  translation: string;
  category: string;
}

interface VocabTableProps {
  vocabulary: IVocabulary[];
}

export default function VocabTable({ vocabulary }: VocabTableProps) {
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);

  const isVerb = (category: string) =>
    ['verb1', 'verb2', 'verb3'].includes(category.toLowerCase());

  const handleVerbClick = (verb: string) => {
    setSelectedVerb(verb);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Word</th>
              <th className="py-2 px-4 border">Translation</th>
            </tr>
          </thead>
          <tbody>
            {vocabulary.map((vocab, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  {isVerb(vocab.category) ? (
                    <span
                      onClick={() => handleVerbClick(vocab.word)}
                      className="font-bold underline text-blue-600 cursor-pointer"
                    >
                      {vocab.word}
                    </span>
                  ) : (
                    <span className="font-bold">{vocab.word}</span>
                  )}
                  , <span className="text-sm italic">{vocab.category}</span>
                </td>
                <td className="py-2 px-4 border">{vocab.translation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conjugation Popup Rendered at Root Level */}
      {selectedVerb && (
        <div>
          <ConjugationPopup
            verb={selectedVerb}
            onClose={() => setSelectedVerb(null)}
          />
        </div>
      )}
    </>
  );
}
