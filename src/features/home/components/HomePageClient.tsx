'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from '@/lib/utils';
import { useAudioState } from '@/context/AudioStateContext';
import { useArticles } from '@/features/articles/hooks/useArticles';
import ArticlesGrid from '@/features/home/components/ArticlesGrid';
import LoadingMessage from '@/features/home/components/LoadingMessage';
import Filter from '@/features/home/components/Filter';
import Header from './Header';

/**
 * Props from server:
 *   - initialArticles: first chunk of articles (no tags)
 *   - availableTags: the full set of tags user can filter by (from DB or wherever)
 */
interface HomePageClientProps {
  initialArticles: any[];
  availableTags: string[];
}

export default function HomePageClient({
  initialArticles,
  availableTags,
}: HomePageClientProps) {
  // Audio context
  const { setMiniPlayerClosed } = useAudioState();

  // On mount, close the mini player
  useEffect(() => {
    setMiniPlayerClosed(true);
  }, [setMiniPlayerClosed]);

  // The user-chosen tags for filtering
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsChanged, setTagsChanged] = useState<boolean>(false);

  // We use our custom hook for infinite scroll, passing in the tags and initial data
  const {
    articles,
    loading,
    hasMore,
    setPage,
    resetDataForNewTags,  // We'll add a function to handle tag change in the hook or logic
  } = useArticles({
    tags: selectedTags,
    tagsChanged: tagsChanged,
    limit: 6,
    initialData: initialArticles,
  });

  // Toggle Filter panel if you want
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter((prev) => !prev);

  // Called when user toggles a specific tag
  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
    setTagsChanged(true);
  };

  // Whenever selectedTags changes, we want to reset to page=1, empty out the old articles, and re-fetch
  // We'll do that in a useEffect, or in the hook's "resetDataForNewTags"
  useEffect(() => {
    if(tagsChanged) {
        resetDataForNewTags(selectedTags);
    }
  }, [tagsChanged, selectedTags, resetDataForNewTags]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        if (!loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      }
    }, 300);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore, setPage]);

  return (
    <div className="container mx-auto p-4">
      {/* Example: A button to toggle filter UI */}
      <Header toggleFilter={toggleFilter} />
      {showFilter && (
        <Filter
          labels={availableTags}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
        />
      )}

      <ArticlesGrid articles={articles} />
      <LoadingMessage loading={loading} hasMore={hasMore} />
    </div>
  );
}
