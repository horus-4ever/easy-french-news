import React from 'react';
import ArticleCard from '@/features/home/components/ArticleCard';

type ArticlesGridProps = {
  articles: {
    _id: string;
    title: string;
    imageUrl: string;
    labels: string[];
    publishDate: string;
  }[];
};

const ArticlesGrid: React.FC<ArticlesGridProps> = ({ articles }) => {
  return (
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
  );
}

export default ArticlesGrid;
