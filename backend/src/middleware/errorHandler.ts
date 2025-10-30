import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === 'ValidationError') {
    const message = 'Validation Error';
    error = createError(message, 400);
  }

  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = createError(message, 404);
  }

  if (err.message?.includes('duplicate')) {
    const message = 'Duplicate field value entered';
    error = createError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const createError = (message: string, statusCode: number): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  return error;
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);