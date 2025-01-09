"use client";

import parse, { DOMNode, domToReact, Element } from 'html-react-parser';
import VocabWord from '@/features/articles/components/VocabWord';
import PlaceWord from '@/features/places/components/PlaceWord';

/**
 * IVocabulary is your existing interface for word, translation, category, etc.
 * If you have a different name or shape, adjust accordingly.
 */
interface IVocabulary {
  word: string;
  category: string;
  translation: string;
}

/**
 * parseContentHtml takes HTML (from the database) and:
 *  - Replaces <vocab vocab-id="X"> with <VocabWord>...<VocabWord/>
 *  - Replaces <place>Paris</place> with <PlaceWord placeName="Paris">Paris</PlaceWord>
 * 
 * param `html`: the raw HTML string
 * param `vocabList`: the array of vocabulary objects (for the <vocab> tags)
 */
export function parseContentHtml(html: string, vocabList: IVocabulary[]) {
  return parse(html, {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) return;

      // 1) Replace <vocab>
      if (domNode.name === 'vocab') {
        const children = (domNode as Element).children as DOMNode[];
        const textContent = domToReact(children).toString().trim();
        const vocabId = (domNode as Element).attribs['vocab-id'];

        // If vocabId is provided, try to map to the vocabulary list
        if (vocabId !== undefined && vocabList[parseInt(vocabId, 10)]) {
          const match = vocabList[parseInt(vocabId, 10)];
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
          // no matching vocab => return plain text
          return textContent;
        }
      }

      // 2) Replace <place>
      if (domNode.name === 'place') {
        // For now we just read the inner text as the place name
        const children = (domNode as Element).children as DOMNode[];
        const placeText = domToReact(children).toString().trim();
        const latitude = (domNode as Element).attribs['lat'];
        const longitude = (domNode as Element).attribs['long'];

        return (
          <PlaceWord placeName={placeText} latitude={latitude} longitude={longitude}>
            {placeText}
          </PlaceWord>
        );
      }
    }
  });
}
