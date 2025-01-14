'use client';

import React, { useState, useEffect, version } from 'react';
import DifficultyToggle from '@/features/articles/components/DifficultyToggle';
import { useAudioState } from '@/context/AudioStateContext';
import AudioPlayer from '@/components/audio/AudioPlayer';
import ArticleDetail from './ArticleDetail';
import GrammarSection from './GrammarSection';
import QuizSection from './QuizSection';
import VocabTable from './VocabTable';
import { IArticle } from '../types/article';

interface ArticlePageClientProps {
  easyContent: any;
  mediumContent: any;
  article: IArticle;
}

export default function ArticlePageClient({ easyContent, mediumContent, article }: ArticlePageClientProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy');
  const { audioRef, setIsPlaying, setCurrentTime, setMiniPlayerClosed } = useAudioState();

  // Whenever difficulty changes, we do a few things:
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
    setMiniPlayerClosed(true);
  }, [difficulty, audioRef, setIsPlaying, setCurrentTime, setMiniPlayerClosed]);

  const version = difficulty === 'easy' ? article.easyVersion : article.mediumVersion;

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 dark:bg-gray-900 dark:text-gray-100">
      {/* Main article content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <h1 className="text-2xl font-bold text-justify flex-grow">{article.title}</h1>
          <div className="flex justify-center sm:justify-start max-w-full">
            <DifficultyToggle difficulty={difficulty} onChange={setDifficulty} />
          </div>
        </div>

        {/* Add space below the title */}
        <div className="mt-6">
          {difficulty === 'easy' ? (
            <ArticleDetail content={easyContent} />
          ) : (
            <ArticleDetail content={mediumContent} />
          )}
        </div>

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
