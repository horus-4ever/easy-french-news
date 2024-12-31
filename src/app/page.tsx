'use client';

import React, { useEffect, useState } from 'react';
import ArticleCard from '@/components/article/ArticleCard';
import { FiFilter } from 'react-icons/fi';
import { useArticles } from '@/hooks/useArticles';

// Article Type
type Article = {
  _id: string;
  title: string;
  imageUrl: string;
  labels: string[];
  publishDate: string;
};

export default function HomePage() {
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [showFilter, setShowFilter] = useState(false);

  const { articles, loading, hasMore, setPage } = useArticles({
    tags: selectedTags,
    limit: 4,
  });

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const res = await fetch('/api/labels');
        const json = await res.json();
        if (json.success) {
          setLabels(json.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLabels();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const toggleFilter = () => {
    setShowFilter((prev) => !prev);
  };

  const handleTagChange = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Derniers articles</h1>
        <button
          onClick={toggleFilter}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          <FiFilter /> Filtres
        </button>
      </div>

      {showFilter && (
        <div className="bg-white p-4 rounded-lg mb-6 shadow">
          <h2 className="font-semibold mb-2">Filtrer par tags</h2>
          <div className="flex flex-wrap gap-3">
            {labels.map((label) => (
              <label
                key={label}
                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border shadow-sm ${selectedTags.includes(label) ? 'bg-green-100 border-green-500' : 'bg-white hover:shadow-md'}`}
              >
                <input
                  type="checkbox"
                  value={label}
                  checked={selectedTags.includes(label)}
                  onChange={() => handleTagChange(label)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 border-2 rounded-md ${selectedTags.includes(label) ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}
                ></div>
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article._id}
            id={article._id}
            title={article.title}
            imageUrl={article.imageUrl}
            labels={article.labels}
            publishDate={article.publishDate}
          />
        ))}
      </div>

      {loading && <p className="text-center mt-6">Loading...</p>}
      {!hasMore && <p className="text-center mt-6">No more articles.</p>}
    </div>
  );
}
