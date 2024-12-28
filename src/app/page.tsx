'use client';

import React, { useEffect, useState } from 'react';
import ArticleCard from '@/components/ArticleCard';
import { migrateDates } from '@/scripts/migrate';

type Article = {
  _id: string;
  title: string;
  imageUrl: string;
  labels: string[];
  publishDate: string;
};

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  

  // 1. Fetch label list
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

  // 2. A function to fetch articles for a given page & tag filters
  const fetchArticles = async (pageNumber: number, tags: string[]) => {
    setLoading(true);
    try {
      // Build query string, e.g. ?tags=science&tags=espace&page=1&limit=3
      const params = new URLSearchParams();
      tags.forEach((tag) => params.append('tags', tag));
      params.append('page', String(pageNumber));
      params.append('limit', '3');

      const res = await fetch(`/api/articles?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        // if we got fewer than 3 articles, means no more
        if (json.data.length < 3) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        // if pageNumber == 1, we replace articles, else we append
        if (pageNumber === 1) {
          setArticles(json.data);
        } else {
          setArticles((prev) => [...prev, ...json.data]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 3. When tags change, reset to page=1
  useEffect(() => {
    setPage(1);
    fetchArticles(1, selectedTags);
  }, [selectedTags]);

  // 4. When page changes (except the very first page=1 due to tags change), fetch the next page
  useEffect(() => {
    if (page > 1) {
      fetchArticles(page, selectedTags);
    }
  }, [page]);

  // 5. Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      // if scrolled to near the bottom
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        // if not loading and we still have more data
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // 6. Handler for toggling a tag
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

      {/* Loading indicator at the bottom */}
      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more articles.</p>}
    </div>
  );
}
