import { AppError, ApiError, ValidationError, SelectError } from '@/types/errors';

export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorCallbacks: ((error: AppError) => void)[] = [];

    private constructor() {}

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    subscribe(callback: (error: AppError) => void): () => void {
        this.errorCallbacks.push(callback);
        return () => {
            this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
        };
    }

    handleError(error: unknown): AppError {
        let appError: AppError;

        if (error instanceof AppError) {
            appError = error;
        } else if (error instanceof Error) {
            appError = new ApiError(error.message);
        } else {
            appError = new ApiError('An unexpected error occurred');
        }

        this.errorCallbacks.forEach(callback => callback(appError));
        return appError;
    }

    createValidationError(message: string, details?: unknown): ValidationError {
        return new ValidationError(message, details);
    }

    createApiError(message: string, status?: number, details?: unknown): ApiError {
        return new ApiError(message, status, details);
    }

    createSelectError(message: string, details?: unknown): SelectError {
        return new SelectError(message, details);
    }
}
