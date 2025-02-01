import parse, { DOMNode, domToReact, Element } from 'html-react-parser';
import VocabWord from '@/features/articles/components/VocabWord';
import PlaceWord from '@/features/places/components/PlaceWord';
import { IVocabulary } from '@/features/articles/types/article';


function getTranslations(translations: any, id: number) {
  const result: any = {}
  for(const language in translations) {
    result[language] = translations[language][id];
  }
  return result;
}

/**
 * parseContentHtml takes HTML (from the database) and:
 *  - Replaces <vocab vocab-id="X"> with <VocabWord>...<VocabWord/>
 *  - Replaces <place>Paris</place> with <PlaceWord placeName="Paris">Paris</PlaceWord>
 * 
 * param `html`: the raw HTML string
 * param `vocabList`: the array of vocabulary objects (for the <vocab> tags)
 */
export function parseContentHtml(html: string, vocabList: IVocabulary) {
  return parse(html, {
    replace: (domNode) => {
      if (!(domNode instanceof Element)) return;

      // 1) Replace <vocab>
      if (domNode.name === 'vocab') {
        const children = (domNode as Element).children as DOMNode[];
        const textContent = domToReact(children).toString().trim();
        const vocabId = parseInt((domNode as Element).attribs['vocab-id'], 10);

        // If vocabId is provided, try to map to the vocabulary list
        if (vocabId !== undefined && vocabList.words[vocabId]) {
          const matchWord = vocabList.words[vocabId];
          const matchTranslations = getTranslations(vocabList.translations, vocabId);
          const matchCategory = vocabList.category[vocabId];
          return (
            <VocabWord
              word={matchWord}
              translations={matchTranslations}
              category={matchCategory}
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
