"use client";

import React, { useState } from 'react';
import ConjugationPopup from '@/features/articles/components/ConjugationPopup';
import { fetchConjugation } from '@/features/conjugation/api/api';
import { useErrorContext } from '@/context/ErrorContext';

interface IVocabulary {
  word: string;
  translation: string;
  category: string;
}

interface VocabTableProps {
  vocabulary: IVocabulary[];
}

export default function VocabTable({ vocabulary }: VocabTableProps) {
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
  const [conjugation, setConjugation] = useState<string | null>(null);
  const { setError } = useErrorContext();

  const isVerb = (category: string) =>
    ['verb1', 'verb2', 'verb3'].includes(category.toLowerCase());

  const handleVerbClick = (verb: string) => {
    fetchConjugation(verb).then((data) => {
      if(!data.success) {
        setError(`Impossible de récupérer la conjugaison de "${verb}".`);
        return;
      }
      setSelectedVerb(verb);
      setConjugation(data.conjugation);
      setPopupOpen(true);
    }
  )};

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="py-2 px-4 border dark:border-gray-600 text-gray-900 dark:text-gray-100">Mot</th>
              <th className="py-2 px-4 border dark:border-gray-600 text-gray-900 dark:text-gray-100">Traduction</th>
            </tr>
          </thead>
          <tbody>
            {vocabulary.map((vocab, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="py-2 px-4 border dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {isVerb(vocab.category) ? (
                    <span
                      onClick={() => handleVerbClick(vocab.word)}
                      className="font-bold underline text-blue-600 dark:text-blue-400 cursor-pointer"
                    >
                      {vocab.word}
                    </span>
                  ) : (
                    <span className="font-bold">{vocab.word}</span>
                  )}
                  , <span className="text-sm italic text-gray-600 dark:text-gray-400">{vocab.category}</span>
                </td>
                <td className="py-2 px-4 border dark:border-gray-700 text-gray-800 dark:text-gray-200">
                  {vocab.translation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conjugation Popup Rendered at Root Level */}
      {popupOpen && selectedVerb && (
        <div>
          <ConjugationPopup
            verb={selectedVerb}
            conjugations={conjugation}
            onClose={() => setPopupOpen(false)}
          />
        </div>
      )}
    </>
  );
}
