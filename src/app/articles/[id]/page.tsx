import React, { useEffect, useState } from 'react';
import dbConnect from '@/lib/dbConnect';
import { getArticleById } from '@/features/articles/services/articleService';
import { parseContentHtml } from '@/lib/parseContent';
import ArticlePageClient from '@/features/articles/components/ArticlePageClient';

type tParams = Promise<{ id: string }>;

export default async function ArticlePage({ params }: { params: tParams }) {
  await dbConnect();
  const articleID = (await params).id;
  const article = await getArticleById(articleID);

  const rawData = JSON.parse(JSON.stringify(article));
  const easyContent = parseContentHtml(rawData.easyVersion.content, rawData.easyVersion.vocabulary);
  const mediumContent = parseContentHtml(rawData.mediumVersion.content, rawData.mediumVersion.vocabulary);
  
  return (
    <ArticlePageClient easyContent={easyContent} mediumContent={mediumContent} article={rawData} />
  );
}