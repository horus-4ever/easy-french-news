"use client";

import React, { useEffect } from 'react';
import DifficultyToggle from '@/features/articles/components/DifficultyToggle';
import { useAudioState } from '@/context/AudioStateContext';
import AudioPlayer from '@/components/audio/AudioPlayer';
import ArticleDetail from './ArticleDetail';
import GrammarSection from './GrammarSection';
import QuizSection from './QuizSection';
import VocabTable from './VocabTable';
import { IArticle } from '../types/article';
import { useReadArticles } from '@/context/ReadArticlesContext';
// ADD:
import Link from 'next/link';

interface ArticlePageClientProps {
  easyContent: any;
  mediumContent: any;
  article: IArticle;
}

export default function ArticlePageClient({ easyContent, mediumContent, article }: ArticlePageClientProps) {
  const { audioRef, setIsPlaying, setCurrentTime, setMiniPlayerClosed } = useAudioState();
  const { markAsRead } = useReadArticles();

  useEffect(() => {
    markAsRead(article._id);
  }, [article._id, markAsRead]);

  const [difficulty, setDifficulty] = React.useState<'easy' | 'medium'>('easy');
  const version = difficulty === 'easy' ? article.easyVersion : article.mediumVersion;

  // Reset the audio whenever difficulty changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
    setMiniPlayerClosed(true);
  }, [difficulty, audioRef, setIsPlaying, setCurrentTime, setMiniPlayerClosed]);

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8 dark:bg-gray-900 dark:text-gray-100">
      {/* Main article content */}
      <div className="flex-1">
        {/* Title + Difficulty Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <h1 className="text-2xl font-bold text-justify flex-grow">{article.title}</h1>
          <div className="flex justify-center sm:justify-start max-w-full">
            <DifficultyToggle difficulty={difficulty} onChange={setDifficulty} />
          </div>
        </div>

        <div className="mt-6">
          {difficulty === 'easy' ? (
            <ArticleDetail content={easyContent} />
          ) : (
            <ArticleDetail content={mediumContent} />
          )}
        </div>

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

        <div className="mt-4">
          <AudioPlayer src={version.audioUrl} />
        </div>

        <br />
        <QuizSection questions={version.questions} />
        <br />
        <GrammarSection grammarPoints={version.grammarPoints} />
      </div>

      {/* Vocab aside */}
      <aside className="w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-md shadow p-4 h-fit self-start">
        <h1 className="text-2xl font-semibold text-green-400 dark:text-green-500">🧠 Vocabulaire (語彙)</h1>
        
        {/* 1) Our existing VocabTable */}
        <VocabTable vocabulary={version.vocabulary} />

        {/* 2) Add a "Learn with Flashcards" button */}
        <div className="mt-4 text-center">
          <Link
            href={`/articles/${article._id}/train?difficulty=${difficulty}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Learn with Flashcards
          </Link>
        </div>
      </aside>
    </div>
  );
}
