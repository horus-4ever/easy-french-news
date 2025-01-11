import { NextRequest, NextResponse } from 'next/server';
import { getConjugations } from '@/features/conjugation/services/conjugationService';
import { BadRequestError, NotFoundError } from '@/lib/errors/errorTypes';
import { handleApiError } from '@/lib/errors/errorHandler';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verb } = body;

    if (!verb) {
      throw new BadRequestError('Invalid request: verb is required');
    }

    // Load conjugations from cache
    const conjugations = await getConjugations();

    // Input may be a sentence, extract the right verb
    const words = verb.split(' ').filter(Boolean);
    let foundVerb = null;
    for (const word of words) {
      if (word in ['ne', 'pas']) {
        continue;
      }
      let searchWord = word;
      if (word.startsWith("s'")) {
        searchWord = word.replace("s'", "");
      }
      const exists = conjugations[searchWord] !== undefined;
      if (exists) {
        foundVerb = searchWord;
        break;
      }
    }

    if (!foundVerb) {
      throw new NotFoundError('Verb not found');
    }

    const conjugation = conjugations[foundVerb];
    if (!conjugation) {
      throw new NotFoundError('Verb not found');
    }
    const response = NextResponse.json({ success: true, foundVerb, conjugation });
    response.headers.set('Cache-Control', 'public, max-age=14400'); // cache for 4 hours
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
