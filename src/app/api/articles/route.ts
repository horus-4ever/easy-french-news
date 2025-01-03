import { NextResponse , NextRequest} from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { getArticles } from '@/lib/services/articleService';
import { handleApiError } from '@/lib/errorHandler';

/**
 * GET articles chunk by chunk
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();    
    const { searchParams } = new URL(request.url);
    const tags = searchParams.getAll('tags');
    const limit = parseInt(searchParams.get('limit') || '3', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    // get the articles
    const articles = await getArticles(tags, limit, page, true);
    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return handleApiError(error);
  }
}