import { handleApiError } from '@/lib/errors/errorHandler';
import getLabels from '@/lib/services/labelsService';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const labels = await getLabels();
    const response = NextResponse.json({ success: true, data: labels });
    response.headers.set('Cache-Control', 'public, max-age=14400'); // cache for 4 hours
    return response;
  } catch (error: any) {
    return handleApiError(error);
  }
}