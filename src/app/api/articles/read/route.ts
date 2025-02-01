// src/app/api/articles/route.ts
import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getArticlesByIds } from '@/features/articles/services/articleService';
import { handleApiError } from '@/lib/errors/errorHandler';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    // Assume the ids are comma-separated.
    const ids = idsParam.split(',').filter(Boolean);
    
    // Use the extracted service function to get articles
    const articles = await getArticlesByIds(ids);
    
    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return handleApiError(error);
  }
}
