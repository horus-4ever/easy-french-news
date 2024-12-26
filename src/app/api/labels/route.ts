import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Label from '@/models/Label';
import Article from '@/models/Article';

export async function GET() {
  try {
    await dbConnect();
    const articles = await Article.find().sort({ name: 1 }).exec();
    let labels: Array<string> = [];
    articles.forEach((article) => {
        labels = [...new Set([...labels, ...article.labels])];
    });
    return NextResponse.json({ success: true, data: labels });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
