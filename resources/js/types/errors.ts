export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public status: number = 500,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}

export class ApiError extends AppError {
    constructor(message: string, status: number = 500, details?: unknown) {
        super(message, 'API_ERROR', status, details);
        this.name = 'ApiError';
    }
}

export class SelectError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'SELECT_ERROR', 400, details);
        this.name = 'SelectError';
    }
}

export interface ErrorResponse {
    success: false;
    error: string;
}

export interface SuccessResponse<T> {
    success: true;
    data: T[];
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
