import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

type tParams = Promise<{ id: string }>;

// GET single article by ID
export async function GET(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    await dbConnect();
    const id = (await params).id;

    const article = await Article.findById(id).lean();
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: article });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT (update) single article by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();
    const updated = await Article.findByIdAndUpdate(id, body, { new: true }).exec();
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE single article by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: tParams }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const deletedArticle = await Article.findByIdAndDelete(id).exec();
    if (!deletedArticle) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: deletedArticle });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
