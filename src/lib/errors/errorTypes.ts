/**
 * Base application error that captures a statusCode.
 */
export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        // Maintain proper stack trace (V8 only)
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Thrown when a resource is not found (e.g. article not found).
 */
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

/**
 * Thrown for bad requests (e.g. missing parameters).
 */
export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

/**
 * (Optional) Add other specialized errors as needed:
 * - UnauthorizedError (401)
 * - ForbiddenError (403)
 * - etc.
 */
