// lib/parseVocabHtml.ts
import parse, { DOMNode, domToReact, Element } from 'html-react-parser';
import VocabWord from '@/components/VocabWord';

interface IVocabulary {
  word: string;
  reading?: string;
  translation: string;
  context?: string; // Optional
}

export function parseVocabHtml(html: string, vocabList: IVocabulary[]) {
  return parse(html, {
    replace: (domNode) => {
      // Only replace if it's <vocab>...</vocab>
      if (domNode instanceof Element && domNode.name === 'vocab') {
        // The text inside <vocab> ... </vocab>
        const children = (domNode as Element).children as DOMNode[];
        const textContent = domToReact(children).toString().trim();

        // Attempt to find a matching object in `vocabList`
        const match = vocabList.find((v) => v.word === textContent);

        if (match) {
          // Wrap it in <VocabWord> so we can show a tooltip
          return (
            <VocabWord
              word={match.word}
              translation={match.translation}
              reading={match.reading}
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
