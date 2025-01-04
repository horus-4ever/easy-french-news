import { useState, useEffect } from 'react';
import { IArticle } from '@/features/articles/types/article';
import { fetchArticleById } from '@/features/articles/api/api';

export function useArticle(articleId: string) {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doFetchArticle = async () => {
      setLoading(true);
      try {
        const json = await fetchArticleById(articleId);
        if (json.success) {
          setArticle(json.data);
        } else {
          setArticle(null);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      doFetchArticle();
    }
  }, [articleId]);  // Trigger whenever articleId changes

  return { article, loading };
}