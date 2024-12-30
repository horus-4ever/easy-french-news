import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Label from '@/models/Label';
import Article from '@/models/Article';

export async function GET() {
  try {
    const labels: Array<string> = ["science", "international", "France", "climat", "culture", "politique"];
    return NextResponse.json({ success: true, data: labels });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
