import type { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library.js';
import { ApiError } from '../utils/ApiError.js';

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        let statusCode = 500;
        let message = error.message || 'Internal Server Error';

        // Prisma Error Handling
        if (error instanceof PrismaClientKnownRequestError) {
            switch (error.code) {
                case 'P2002': // Unique constraint violation
                    statusCode = 409;
                    message = 'Duplicate entry found';
                    break;
                case 'P2025': // Record not found
                    statusCode = 404;
                    message = 'Record not found';
                    break;
                case 'P2003': // Foreign key constraint violation
                    statusCode = 400;
                    message = 'Invalid reference to related record';
                    break;
                default:
                    statusCode = 400;
                    message = `Database Error: ${error.message}`;
            }
        } else if (error instanceof PrismaClientValidationError) {
             statusCode = 400;
             message = 'Validation Error: Invalid data format';
        }

        error = new ApiError(statusCode, message, statusCode < 500, err.stack);
    }
    next(error);
};

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    let { statusCode, message } = err;
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        statusCode = 500;
        message = 'Internal Server Error';
    }

    res.locals.errorMessage = err.message;

    const response = {
        status: 'error',
        code: err.code || statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && !err.isOperational && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    res.status(statusCode).send(response);
};
