import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  status?: number;
  details?: any;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[Error] ${req.method} ${req.url} - Status ${status}: ${message}`);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(status).json({
    error: message,
    details: err.details || null,
  });
};
