"use client";

import React, { useState, useEffect } from 'react';
import { debounce } from '@/lib/utils';
import { useAudioState } from '@/context/AudioStateContext';
import { useArticles } from '@/features/articles/hooks/useArticles';
import ArticlesGrid from '@/features/home/components/ArticlesGrid';
import LoadingMessage from '@/features/home/components/LoadingMessage';
import Filter from '@/features/home/components/Filter';
import { FiFilter } from 'react-icons/fi';
import { useReadArticles } from '@/context/ReadArticlesContext';

interface HomePageClientProps {
  initialArticles: any[];
  availableTags: string[];
}

export default function HomePageClient({
  initialArticles,
  availableTags,
}: HomePageClientProps) {
  // Audio context: close mini player
  const { setMiniPlayerClosed } = useAudioState();
  useEffect(() => {
    setMiniPlayerClosed(true);
  }, [setMiniPlayerClosed]);

  // Tag filtering (for "all articles" mode)
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsChanged, setTagsChanged] = useState<boolean>(false);

  const { articles, loading, hasMore, setPage, resetDataForNewTags } = useArticles({
    tags: selectedTags,
    tagsChanged: tagsChanged,
    limit: 6,
    initialData: initialArticles,
  });

  // Toggle for tag filters and "Show Only Read" mode
  const [showFilter, setShowFilter] = useState(false);
  const toggleFilter = () => setShowFilter((prev) => !prev);

  const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setTagsChanged(true);
  };

  useEffect(() => {
    if (tagsChanged) {
      resetDataForNewTags(selectedTags);
    }
  }, [tagsChanged, selectedTags, resetDataForNewTags]);

  // Toggle between "All Articles" and "Read Articles" mode
  const { readArticles } = useReadArticles();
  const [showOnlyRead, setShowOnlyRead] = useState(false);
  const [readArticlesData, setReadArticlesData] = useState<any[]>([]);
  const [loadingRead, setLoadingRead] = useState(false);

  useEffect(() => {
    if (showOnlyRead) {
      if (readArticles.length > 0) {
        setLoadingRead(true);
        fetch(`/api/articles/read?ids=${readArticles.join(",")}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setReadArticlesData(data.data);
            }
          })
          .catch((err) => console.error("Error fetching read articles:", err))
          .finally(() => setLoadingRead(false));
      } else {
        setReadArticlesData([]);
      }
    }
  }, [showOnlyRead, readArticles]);

  // Infinite scroll (only for "all articles" mode)
  useEffect(() => {
    if (!showOnlyRead) {
      const handleScroll = debounce(() => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
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
    }
  }, [loading, hasMore, setPage, showOnlyRead]);

  return (
    <div className="container mx-auto p-4">
      {/* Header: title and buttons on the same line */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
  <h1 className="text-2xl font-bold">Derniers articles</h1>
  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
    <button
      onClick={toggleFilter}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 h-fit border rounded-lg bg-green-600 text-white hover:bg-green-700 dark:border-green-900 w-full sm:w-auto text-center"
    >
      <FiFilter /> Filtres
    </button>
    <button
      onClick={() => setShowOnlyRead((prev) => !prev)}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 h-fit border rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-900 w-full sm:w-auto text-center"
    >
      {showOnlyRead ? "Show All Articles" : "Show Only Read"}
    </button>
  </div>
</div>



      {/* Optionally render filter options if toggled */}
      {showFilter && (
        <Filter
          labels={availableTags}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
        />
      )}

      {/* Display articles */}
      {showOnlyRead ? (
        <>
          {loadingRead ? (
            <LoadingMessage loading={true} hasMore={false} />
          ) : (
            <ArticlesGrid articles={readArticlesData} />
          )}
        </>
      ) : (
        <>
          <ArticlesGrid articles={articles} />
          <LoadingMessage loading={loading} hasMore={hasMore} />
        </>
      )}
    </div>
  );
}
