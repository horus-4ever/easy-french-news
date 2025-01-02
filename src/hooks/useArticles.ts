import { fetchArticles } from '@/lib/api';
import { useState, useEffect } from 'react';

type Article = {
  _id: string;
  title: string;
  imageUrl: string;
  labels: string[];
  publishDate: string;
};

// Define props for filtering and pagination
interface UseArticlesProps {
  tags: string[];
  limit: number;
}

export function useArticles({ tags, limit }: UseArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const doFetchArticles = async (pageNumber: number) => {
    setLoading(true);
    try {
      const json = await fetchArticles(tags, pageNumber, limit);
      if (json.success) {
        setHasMore(json.data.length === limit);  // if data.length < limit, no more articles
        if (pageNumber === 1) {
          setArticles(json.data);
        } else {
          setArticles((prev) => [...prev, ...json.data]);  // append new articles
        }
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setArticles([]);  // Clear articles when tags change
    setPage(1);
    doFetchArticles(1);
  }, [tags]);  // Refetch if tags change

  useEffect(() => {
    doFetchArticles(page);
  }, [page]);  // Fetch next page when `page` changes

  return { articles, loading, hasMore, setPage };
}
