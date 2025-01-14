import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getArticleById } from '@/features/articles/services/articleService';
import { handleApiError } from '@/lib/errors/errorHandler';

type tParams = Promise<{ id: string }>;

// GET single article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    await dbConnect();
    const id = (await params).id;

    const article = await getArticleById(id);
    const response = NextResponse.json({ success: true, data: article });
    response.headers.set('Cache-Control', 'public, max-age=10'); // cache for 1/2 hour
    return response;
  } catch (error: any) {
    return handleApiError(error);
  }
}
