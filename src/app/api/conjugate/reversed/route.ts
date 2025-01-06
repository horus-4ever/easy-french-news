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
    return NextResponse.json({ success: true, matched });
  } catch (error) {
    return handleApiError(error);
  }
}
