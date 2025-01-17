'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleDetail from '@/features/articles/components/ArticleDetail';
import VocabTable from '@/features/articles/components/VocabTable';
import GrammarSection from '@/features/articles/components/GrammarSection';
import AudioPlayer from '@/components/audio/AudioPlayer';
import QuizSection from '@/features/articles/components/QuizSection';
import DifficultyToggle from '@/features/articles/components/DifficultyToggle';
import { useArticle } from '@/features/articles/hooks/useArticle';
import { useAudioState } from '@/context/AudioStateContext';

export default function ArticlePage() {
  const { id } = useParams() as { id: string };
  const { article, loading } = useArticle(id);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy');
  const { audioRef, setIsPlaying, setCurrentTime, setMiniPlayerClosed } = useAudioState();

  useEffect(() => {
    // Reset audio player when difficulty changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [difficulty, article]);

  useEffect(() => {
    // close the miniplayer when the difficulty changes
    setMiniPlayerClosed(true);
  }, [difficulty]);

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
