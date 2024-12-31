import { NextResponse } from 'next/server';

/**
 * Centralized error handler for Next.js API routes.
 *
 * @param res - The response object
 * @param error - The caught error object
 * @param statusCode - Optional HTTP status code (default: 500)
 */
export function handleApiError(error: any, statusCode: number = 500) {
  const errorMessage = error.message || 'An unknown error occurred';
  console.error(`❌ Error: ${errorMessage}`);
  return NextResponse.json(
    { success: false, error: errorMessage },
    { status: statusCode }
  );
}
