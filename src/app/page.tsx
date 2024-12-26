'use client';

import React, { useEffect, useState } from 'react';
import ArticleCard from '@/components/ArticleCard';

type Article = {
  _id: string;
  title: string;
  imageUrl: string;
  labels: string[];
  publishDate: string;
};

type Label = {
  _id: string;
  name: string;
  count: number;
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Load all labels from /api/labels
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

  // 2. Whenever `selectedTags` changes, fetch the articles filtered by these tags
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);

        // Build query string, e.g. /api/articles?tags=science&tags=espace
        const params = new URLSearchParams();
        selectedTags.forEach((tag) => params.append('tags', tag));

        const res = await fetch(`/api/articles?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setArticles(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [selectedTags]);

  // 3. Handler for toggling a tag
  const handleTagChange = (tagName: string) => {
    setSelectedTags((prev) => {
      // If tag is already selected, unselect it
      if (prev.includes(tagName)) {
        return prev.filter((t) => t !== tagName);
      }
      // Otherwise, add it
      return [...prev, tagName];
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Latest Articles</h1>

      {/* Tag Filters */}
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Filter by Tags</h2>
        <div className="flex flex-wrap gap-4">
          {labels.map((label) => (
            <label key={label} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                value={label}
                checked={selectedTags.includes(label)}
                onChange={() => handleTagChange(label)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Article List */}
      {loading && <p>Loading...</p>}
      {!loading && (
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
      )}
    </div>
  );
}
