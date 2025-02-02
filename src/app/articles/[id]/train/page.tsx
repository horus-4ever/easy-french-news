"use client";

import React, { useEffect, useState } from 'react';
import FlashcardsTrainerClient from '@/features/flashcards/components/FlashcardsTrainerClient';
import { IArticle } from '@/features/articles/types/article';
import { fetchArticleById } from '@/features/articles/api/api';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ difficulty: string }>;
};

export default function FlashcardsPage({ params, searchParams }: Props) {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [version, setVersion] = useState<any>(null);

  // On mount, fetch the article and set initial difficulty/version.
  useEffect(() => {
    const fetchArticle = async () => {
      const articleID = (await params).id;
      const articleResponse = await fetchArticleById(articleID);
      const fetchedArticle: IArticle = articleResponse.data;
      setArticle(fetchedArticle);

      // Set initial difficulty from searchParams (default to "easy")
      const initDiff = (await searchParams).difficulty || "easy";
      setDifficulty(initDiff);

      // Choose the appropriate version (easy or medium)
      const ver = initDiff === 'medium'
        ? fetchedArticle.mediumVersion
        : fetchedArticle.easyVersion;
      setVersion(ver);
    };

    fetchArticle();
  }, [params, searchParams]);

  // Whenever the difficulty changes (via the selector) and the article is loaded,
  // update the version accordingly.
  useEffect(() => {
    if (article) {
      const newVersion = difficulty === 'medium'
        ? article.mediumVersion
        : article.easyVersion;
      setVersion(newVersion);
    }
  }, [difficulty, article]);

  // Handler for the version selector.
  const handleSelectDifficulty = (newDiff: string) => {
    setDifficulty(newDiff);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Version Selector */}
      <div className="flex justify-center mb-4">
        <button 
          onClick={() => handleSelectDifficulty("easy")}
          className={`px-4 py-2 mr-2 rounded transition 
                      ${difficulty === "easy" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800"}`}
        >
          Easy
        </button>
        <button 
          onClick={() => handleSelectDifficulty("medium")}
          className={`px-4 py-2 rounded transition 
                      ${difficulty === "medium" 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800"}`}
        >
          Medium
        </button>
      </div>

      {/* Render the flashcards trainer if the version is loaded */}
      {version && (
        <FlashcardsTrainerClient
          vocab={version.vocabulary}
        />
      )}
    </div>
  );
}
