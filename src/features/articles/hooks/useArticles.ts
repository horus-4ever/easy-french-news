import { useState, useEffect, useCallback } from 'react';
import { useErrorContext } from '@/context/ErrorContext';
import { fetchArticles } from '../api/api';

interface UseArticlesProps {
  tags: string[];
  tagsChanged: boolean;
  limit: number;
  initialData?: any[]; // first page from server
}

export function useArticles({ tags, tagsChanged, limit, initialData = [] }: UseArticlesProps) {
  const [articles, setArticles] = useState<any[]>(initialData);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { setError } = useErrorContext();

  /**
   * A callback that resets everything so we can re-fetch with new tags
   * Called from the client component if selectedTags changes.
   */
  const resetDataForNewTags = useCallback(
    (newTags: string[]) => {
      setPage(1);
      setArticles([]);
      setHasMore(true);
    },
    []
  );

  // Whenever page changes, load articles from /api/articles
  useEffect(() => {
    let canceled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchArticles(tags, page, limit);
        if (!canceled) {
          if (data.success) {
            const newArticles = data.data;
            setHasMore(newArticles.length === limit);

            // If page=1, we overwrite
            if (page === 1) {
              setArticles(newArticles);
            } else {
              // Otherwise, we append
              setArticles((prev) => [...prev, ...newArticles]);
            }
          } else {
            setError('Impossible de récupérer les articles. Réessayez plus tard.');
          }
        }
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        if (!canceled) {
          setError('Erreur réseau ou serveur. Impossible de récupérer les articles.');
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    if (!tagsChanged && page === 1) {
      return;
    }

    load();
    return () => {
      canceled = true;
    };
  }, [tags, page, limit, setError]);

  return {
    articles,
    loading,
    hasMore,
    setPage,
    resetDataForNewTags,
  };
}
