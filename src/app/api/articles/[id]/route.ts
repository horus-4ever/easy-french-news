import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getArticleById } from '@/features/articles/services/articleService';
import { handleApiError } from '@/lib/errors/errorHandler';
import { NotFoundError } from '@/lib/errors/errorTypes';

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
    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    return handleApiError(error);
  }
}
