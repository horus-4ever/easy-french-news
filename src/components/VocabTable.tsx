// components/VocabTable.tsx
import React from 'react';

interface IVocabulary {
  word: string;
  translation: string;
  reading?: string;
  context?: string;
}

interface VocabTableProps {
  vocabulary: IVocabulary[];
}

export default function VocabTable({ vocabulary }: VocabTableProps) {
  return (
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
              <td className="py-2 px-4 border">{vocab.word}</td>
              <td className="py-2 px-4 border">{vocab.translation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
