import { handleApiError } from '@/lib/errors/errorHandler';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const labels: Array<string> = ["science", "international", "France", "climat", "culture", "politique"];
    return NextResponse.json({ success: true, data: labels });
  } catch (error: any) {
    handleApiError(error);
  }
}