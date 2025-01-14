import React from 'react';
import dbConnect from '@/lib/dbConnect';
import { getArticles } from '@/features/articles/services/articleService';
import HomePageClient from '@/features/home/components/HomePageClient';
import getLabels from '@/lib/services/labelsService';

/**
 * A server-side function to fetch the first chunk of articles
 * and pass them to our client component.
 */
export default async function Page() {
  // 1) Ensure DB is connected
  await dbConnect();

  // 2) Fetch the first 4 published articles
  const firstPageArticles = await getArticles([], 6, 1, true);

  // 3) Convert to plain objects so Next.js can serialize them
  const serialized = JSON.parse(JSON.stringify(firstPageArticles));

  const allTags = await getLabels();
  // 4) Return the client component. Pass the articles as props
  return (
    <HomePageClient initialArticles={serialized} availableTags={allTags} />
  );
}
