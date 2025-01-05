'use client';

import React, { useEffect, useState, useRef } from 'react';
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

  const hasMoreRef = useRef(hasMore); // Keep track of hasMore state
  const loadingRef = useRef(loading); // Keep track of loading state

  useEffect(() => {
    setMiniPlayerClosed(true);
  }, []);

  useEffect(() => {
    fetchLabels().then((response) => setLabels(response.data));
  }, []);

  // Update refs whenever state changes
  useEffect(() => {
    hasMoreRef.current = hasMore;
    loadingRef.current = loading;
  }, [hasMore, loading]);

  // Debounced Scroll Handler
  const handleScroll = debounce(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    ) {
      // Use refs to avoid stale closure issues
      if (!loadingRef.current && hasMoreRef.current) {
        console.log('Fetching more articles');
        setPage((prev) => prev + 1);
      }
    }
  }, 300);

  // Attach and Detach Scroll Listener
  useEffect(() => {
    const onScroll = () => {
      if (!loadingRef.current && hasMoreRef.current) {
        handleScroll();
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [handleScroll]);  // Attach the latest debounced function

  // Toggle filter visibility
  const toggleFilter = () => setShowFilter((prev) => !prev);

  // Handle tag selection
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
