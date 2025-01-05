import { NextRequest, NextResponse } from 'next/server';
import { getConjugations } from '@/features/conjugation/services/conjugationService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verb } = body;

    if (!verb) {
      return NextResponse.json(
        {
          error: 'Invalid request: verb is required',
        },
        { status: 400 }
      );
    }

    // Load conjugations from cache
    const conjugations = await getConjugations();
    if (conjugations === null) {
      return NextResponse.json(
        {
          error: 'Internal Server Error',
        },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        {
          error: 'Verb not found',
        },
        { status: 404 }
      );
    }

    const conjugation = conjugations[foundVerb];
    if (conjugation) {
      return NextResponse.json({
        foundVerb: foundVerb,
        conjugation: conjugation,
      });
    } else {
      return NextResponse.json(
        {
          error: 'Verb not found',
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching conjugation:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
