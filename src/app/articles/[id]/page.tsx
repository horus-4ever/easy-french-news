'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleDetail from '@/components/article/ArticleDetail';
import { IArticle } from '@/models/Article';
import VocabTable from '@/components/article/VocabTable';
import GrammarSection from '@/components/article/GrammarSection';
import AudioPlayer from '@/components/audio/AudioPlayer';
import QuizSection from '@/components/article/QuizSection';
import DifficultyToggle from '@/components/article/DifficultyToggle';
import { useArticle } from '@/hooks/useArticle';

export default function ArticlePage() {
  const { id } = useParams() as { id: string };
  const { article, loading } = useArticle(id);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy');

  if (loading) return <p className="text-gray-800 dark:text-gray-200">Loading...</p>;
  if (!article) return <p className="text-gray-800 dark:text-gray-200">Article not found.</p>;

  const version = difficulty === 'easy' ? article.easyVersion : article.mediumVersion;

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 dark:bg-gray-900 dark:text-gray-100">
      {/* Main article content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <DifficultyToggle difficulty={difficulty} onChange={setDifficulty} />
        </div>

        {/* Reusable component to display the article HTML, etc. */}
        <ArticleDetail content={version.content} vocabulary={version.vocabulary} />

        {/* Link to original article (subtle) */}
        <div className="text-right text-sm text-gray-400 dark:text-gray-500 mt-2">
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Article original
          </a>
        </div>

        {/* Audio player */}
        <div className="mt-4">
          <AudioPlayer src={version.audioUrl}></AudioPlayer>
        </div>

        <br />
        
        {/* Quiz section */}
        <QuizSection questions={version.questions} />
        <br />

        {/* Grammar Section */}
        <GrammarSection grammarPoints={version.grammarPoints} />
      </div>

      {/* Right side panel for vocabulary & grammar */}
      <aside className="w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-md shadow p-4 h-fit self-start">
        <h1 className="text-2xl font-semibold text-green-400 dark:text-green-500">🧠 Vocabulaire (語彙)</h1>
        <VocabTable vocabulary={version.vocabulary} />
      </aside>
    </div>
  );
}
