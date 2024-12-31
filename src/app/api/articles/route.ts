import { NextResponse , NextRequest} from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

/**
 * GET all articles
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const tags = searchParams.getAll('tags');
    
    // new: parse pagination params
    const limit = parseInt(searchParams.get('limit') || '3', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;

    let query: any = {};
    if (tags.length > 0) {
      query = { labels: { $in: tags } };
    }

    // We only want to load the fields needed for the article cards
    // i.e. no easyVersion, no mediumVersion
    const articles = await Article.find(query)
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('title imageUrl labels publishDate') // only keep these fields
      .exec();

    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}