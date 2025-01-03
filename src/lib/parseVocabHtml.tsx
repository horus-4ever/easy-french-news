// lib/parseVocabHtml.ts
"use client";

import parse, { DOMNode, domToReact, Element } from 'html-react-parser';
import VocabWord from '@/components/article/VocabWord';

interface IVocabulary {
  word: string;
  category: string;
  translation: string;
}

export function parseVocabHtml(html: string, vocabList: IVocabulary[]) {
  return parse(html, {
    replace: (domNode) => {
      // Only replace if it's <vocab>...</vocab>
      if (domNode instanceof Element && domNode.name === 'vocab') {
        // The text inside <vocab> ... </vocab>
        const children = (domNode as Element).children as DOMNode[];
        const textContent = domToReact(children).toString().trim();
        const vocabId = (domNode as Element).attribs['vocab-id'];

        // Attempt to find a matching object in `vocabList`
        const match = vocabList[parseInt(vocabId, 10)];

        if (match) {
          // Wrap it in <VocabWord> so we can show a tooltip
          return (
            <VocabWord
              word={match.word}
              translation={match.translation}
              category={match.category}
            >
              {textContent}
            </VocabWord>
          );
        } else {
          // If not found, just return the text as-is
          return textContent;
        }
      }
    }
  });
}
