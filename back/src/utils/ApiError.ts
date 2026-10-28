export class ApiError extends Error {
    statusCode: number;
    code?: string;
    isOperational: boolean;

    constructor(statusCode: number, message: string, codeOrIsOperational: string | boolean = true, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        if (typeof codeOrIsOperational === 'string') {
            this.code = codeOrIsOperational;
            this.isOperational = isOperational;
        } else {
            this.isOperational = codeOrIsOperational;
        }
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

