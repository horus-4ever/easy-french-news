// components/ArticleDetail.tsx
import React from 'react';
import { parseVocabHtml } from '@/lib/parseVocabHtml';

interface IVocabulary {
  word: string;
  reading?: string;
  translation: string;
  context?: string;
}

interface ArticleDetailProps {
  content: string;             // HTML from either easyVersion.content or mediumVersion.content
  vocabulary: IVocabulary[];   // The corresponding vocabulary array
}

export default function ArticleDetail({ content, vocabulary }: ArticleDetailProps) {
  return (
    <div className="prose max-w-none">
      {/* This function converts <vocab> text into <VocabWord> components */}
      {parseVocabHtml(content, vocabulary)}
    </div>
  );
}
