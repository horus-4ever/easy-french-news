'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ArticleDetail from '../../../components/ArticleDetail';
import { IArticle } from '@/models/Article';

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
          <h1 className="text-xl font-bold">{article.title}</h1>
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
          <p className="font-semibold mb-2">Article Audio</p>
          {/* A custom audio player or simple HTML <audio> */}
          <audio controls src={version.audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>

      {/* Right side panel for vocabulary & grammar */}
      <aside className="w-full md:w-1/3 bg-white rounded-md shadow p-4 h-fit self-start">
        <h2 className="text-lg font-semibold">Vocabulary</h2>
        <ul className="list-disc list-inside mb-4">
          {version.vocabulary.map((vocab, i) => (
            <li key={i} className="my-1">
              <strong>{vocab.word}</strong> - {vocab.translation}
              {vocab.reading && ` (${vocab.reading})`}
              {vocab.context && <em> — {vocab.context}</em>}
            </li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold">Grammar Points</h2>
        <div className="space-y-4">
          {version.grammarPoints.map((grammar, i) => (
            <div key={i}>
              <h3 className="font-medium">{grammar.title}</h3>
              <p>{grammar.explanation}</p>
              {grammar.examples.map((ex, idx) => (
                <div key={idx} className="ml-4 mt-2">
                  <p className="italic">FR: {ex.french}</p>
                  <p>JP: {ex.japanese}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
