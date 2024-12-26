'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleDetail from '@/components/ArticleDetail';
import { IArticle } from '@/models/Article';
import VocabTable from '@/components/VocabTable';
import GrammarSection from '@/components/GrammarSection';
import AudioPlayer from '@/components/AudioPlayer';
import QuizSection from '@/components/QuizSection';

export default function ArticlePage() {
  const params = useParams();
  const { id } = params as { id: string };

  const [article, setArticle] = useState<IArticle | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/articles/${id}`);
        const json = await res.json();
        if (json.success) {
          setArticle(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!article) return <p>Article not found.</p>;

  const version = difficulty === 'easy' ? article.easyVersion : article.mediumVersion;

  return (
    <div className="container mx-auto flex flex-col md:flex-row gap-8">
      {/* Main article content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{article.title}</h1>
          <div>
            <button
              onClick={() => setDifficulty('easy')}
              className={`mr-2 px-4 py-2 rounded ${
                difficulty === 'easy' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`px-4 py-2 rounded ${
                difficulty === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Medium
            </button>
          </div>
        </div>

        {/* Reusable component to display the article HTML, etc. */}
        <ArticleDetail content={version.content} vocabulary={version.vocabulary} />

        {/* Audio player */}
        <div className="mt-4">
          <p className="font-semibold">Article Audio</p>
          {/* A custom audio player or simple HTML <audio> */}
          <AudioPlayer src={version.audioUrl}></AudioPlayer>
        </div>

        <br />
        
        {/* Quiz section */}
        <QuizSection questions={version.questions} />
        <br />

        {/* Grammar Section */}
        <GrammarSection grammarPoints={version.grammarPoints}/>
      </div>

      {/* Right side panel for vocabulary & grammar */}
      <aside className="w-full md:w-1/3 bg-white rounded-md shadow p-4 h-fit self-start">
        <h1 className="text-2xl font-semibold text-green-400">🧠 Vocabulaire (語彙)</h1>
        <VocabTable vocabulary={version.vocabulary} />
      </aside>

    </div>
  );
}
