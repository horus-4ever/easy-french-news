'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type UnpublishedArticle = {
  _id: string;
  title: string;
  publishDate: string;
};

export default function UnpublishedPage() {
  // this page is visible on purpose
  const [articles, setArticles] = useState<UnpublishedArticle[]>([]);

  useEffect(() => {
    const fetchUnpublishedArticles = async () => {
      try {
        const res = await fetch('/api/unpublished');
        const json = await res.json();
        if (json.success) {
          setArticles(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch unpublished articles:', err);
      }
    };

    fetchUnpublishedArticles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Unpublished Articles</h1>
      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md">
            <Link href={`/articles/${article._id}`} className="text-lg font-medium hover:underline">
              {article.title}
            </Link>
            <p className="text-sm text-gray-500">Published on: {new Date(article.publishDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
