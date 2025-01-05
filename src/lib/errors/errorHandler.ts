// src/lib/errorHandler.ts
import { NextResponse } from 'next/server';
import { AppError } from './errorTypes';

/**
 * Centralized error handler for Next.js API routes.
 *
 * @param error - The caught error object
 */
export function handleApiError(error: unknown) {
  // Check if this is an instance of our custom AppError
  if (error instanceof AppError) {
    console.error(`❌ [${error.name}] ${error.message}`);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode }
    );
  }

  // Otherwise, something else was thrown
  console.error('❌ [Unhandled Error]', error);
  return NextResponse.json(
    { success: false, error: 'Internal Server Error' },
    { status: 500 }
  );
}
