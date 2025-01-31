import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Article } from '@/features/articles/models/Article';
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
    const articles = await Article.find({ _id: { $in: ids } })
      .sort({ publishDate: -1 })
      .select('title imageUrl labels publishDate')
      .exec();
    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return handleApiError(error);
  }
}
