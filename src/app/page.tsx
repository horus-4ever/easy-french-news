'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/features/home/components/Header';
import Filter from '@/features/home/components/Filter';
import ArticlesGrid from '@/features/home/components/ArticlesGrid';
import LoadingMessage from '@/features/home/components/LoadingMessage';
import { useArticles } from '@/features/articles/hooks/useArticles';
import { useAudioState } from '@/context/AudioStateContext';
import { fetchLabels } from '@/lib/api';
import { debounce } from '@/lib/utils';

export default function HomePage() {
  const [labels, setLabels] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { setMiniPlayerClosed } = useAudioState();
  const [showFilter, setShowFilter] = useState(false);

  const { articles, loading, hasMore, setPage } = useArticles({
    tags: selectedTags,
    limit: 4,
  });

  useEffect(() => {
    setMiniPlayerClosed(true);
  }, []);

  useEffect(() => {
    fetchLabels().then((response) => setLabels(response.data));
  }, []);

  // Debounced scroll handler
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        // Directly check loading and hasMore from state
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    }, 300);

    // Attach scroll listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]);  // Depend directly on loading and hasMore

  const toggleFilter = () => setShowFilter((prev) => !prev);

  const handleTagChange = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900">
      <Header toggleFilter={toggleFilter} />
      {showFilter && (
        <Filter
          labels={labels}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
        />
      )}
      <ArticlesGrid articles={articles} />
      <LoadingMessage loading={loading} hasMore={hasMore} />
    </div>
  );
}
