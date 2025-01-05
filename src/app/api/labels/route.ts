import { NextResponse } from 'next/server';

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