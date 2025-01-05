import { NextResponse , NextRequest} from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getUnpublishedArticles } from '@/features/articles/services/articleService';
import { handleApiError } from '@/lib/errorHandler';

export async function GET(request: NextRequest) {
  // everyone can see unpublished articles, this is a wanted behavior
  try {
    await dbConnect();    
    // get the unpublished articles
    const articles = await getUnpublishedArticles();
    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return handleApiError(error);
  }
}