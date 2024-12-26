// components/GrammarSection.tsx
import React from 'react';
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
  return (
    <aside className="w-full bg-white rounded-md shadow p-4 h-fit self-start">
      <h2 className="text-2xl font-semibold text-green-400 mb-4">Grammaire (文法)</h2>
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
    </aside>
  );
}
