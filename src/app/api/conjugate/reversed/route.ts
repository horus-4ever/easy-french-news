import { NextRequest, NextResponse } from 'next/server';
import { getConjugations } from '@/features/conjugation/services/conjugationService';
import { BadRequestError, NotFoundError } from '@/lib/errors/errorTypes';
import { handleApiError } from '@/lib/errors/errorHandler';
import { findInTrie, getTrieRoot } from '@/features/conjugation/services/reversedConjugationService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { verb } = body;

    if (!verb) {
      throw new BadRequestError('Invalid request: verb is required');
    }

    const tree = await getTrieRoot();
    const matched = await findInTrie(tree, verb);
    
    if (!matched) {
      throw new NotFoundError('Verb not found');
    }
    const response = NextResponse.json({ success: true, matched });
    response.headers.set('Cache-Control', 'public, max-age=14400');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
