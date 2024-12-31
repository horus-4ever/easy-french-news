import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import { getArticleById } from '@/lib/services/articleService';
import { handleApiError } from '@/lib/errorHandler';

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
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    return handleApiError(error);
  }
}
