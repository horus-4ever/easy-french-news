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
      // We expect multiple tags as "tags=science&tags=espace"
      const tags = searchParams.getAll('tags'); // returns an array of strings
  
      let query = {};
  
      if (tags.length > 0) {
        // For an article to match, it must have *all* these labels
        //   - i.e. an article with labels: ["science", "espace"] 
        //     matches tags=["science","espace"] 
        //   - If you want "ANY" match, see below for alternative
        query = { labels: { $in: tags } };
      }
  
      const articles = await Article.find(query).sort({ createdAt: -1 }).exec();
  
      return NextResponse.json({ success: true, data: articles });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  }
  

/**
 * POST create new article
 */
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newArticle = await Article.create(body);
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
