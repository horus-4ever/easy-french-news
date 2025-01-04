"use client";

import React from 'react';
import { parseVocabHtml } from '@/lib/parseVocabHtml';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface IVocabulary {
  word: string;
  category: string;
  translation: string;
}

interface ArticleDetailProps {
  content: string;             // HTML from either easyVersion.content or mediumVersion.content
  vocabulary: IVocabulary[];   // The corresponding vocabulary array
}

export default function ArticleDetail({ content, vocabulary }: ArticleDetailProps) {
  const sanitizedContent = sanitizeHtml(content);
  const parsedContent = parseVocabHtml(sanitizedContent, vocabulary);
  return (
    <div className="prose max-w-none text-xl text-justify">
      {parsedContent}
    </div>
  );
}
