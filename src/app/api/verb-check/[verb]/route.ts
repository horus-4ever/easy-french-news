import { NextRequest, NextResponse } from 'next/server';
import { loadConjugations } from '@/lib/conjugationCache';

type tParams = Promise<{ verb: string }>;

// API route handler
export async function GET(
  req: NextRequest,
  { params }: { params: tParams }
) {
  const { verb } = await params;

  try {
    const conjugations = await loadConjugations();

    // Check if the verb exists
    const exists = Object.prototype.hasOwnProperty.call(conjugations, verb);

    if (exists) {
      return NextResponse.json({ exists: true });
    } else {
      return NextResponse.json({ exists: false }, { status: 404 });
    }
  } catch (error) {
    console.error('Error checking verb:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
