import { NextRequest, NextResponse } from 'next/server';
import { loadConjugations } from '@/lib/conjugationCache';

type tParams = Promise<{ verb: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: tParams }
) {
  const { verb } = await params;

  try {
    // Load conjugations from cache
    const conjugations = await loadConjugations();
    if(conjugations === null) {
        return NextResponse.json(
            {
            error: 'Internal Server Error',
            },
            { status: 500 }
        );
    }

    // Lookup the verb
    const conjugation = conjugations[verb];

    if (conjugation) {
      return NextResponse.json({
        verb,
        conjugation,
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
