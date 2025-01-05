import { NextRequest, NextResponse } from 'next/server';
import { getConjugations } from '@/features/conjugation/services/conjugationService';
import { NotFoundError } from '@/lib/errors/errorTypes';
import { handleApiError } from '@/lib/errors/errorHandler';

type tParams = Promise<{ verb: string }>;

// API route handler
export async function GET(
  req: NextRequest,
  { params }: { params: tParams }
) {
  const { verb } = await params;

  try {
    const conjugations = await getConjugations();

    // Check if the verb exists
    const exists = Object.prototype.hasOwnProperty.call(conjugations, verb);
    if(!exists) {
      throw new NotFoundError ('Verb not found');
    }
    return NextResponse.json({ exists: true });
  } catch (error) {
    return handleApiError(error);
  }
}
