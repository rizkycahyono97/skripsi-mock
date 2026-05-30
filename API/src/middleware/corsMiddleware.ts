import { Response, NextFunction, Request, ErrorRequestHandler } from 'express';
import cors, { CorsOptions } from 'cors';
import { sendError } from '../utils/responseFormatter';

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const allowedOrigins: string[] = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : [];
    if (
      !origin ||
      allowedOrigins.indexOf(origin) !== -1 ||
      allowedOrigins.includes('*')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: process.env.CORS_METHODS
    ? process.env.CORS_METHODS.split(',')
    : ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: process.env.CORS_HEADERS
    ? process.env.CORS_HEADERS.split(',')
    : ['Content-Type', 'X-API-Key'],
  credentials: true,
  optionsSuccessStatus: 200
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(`\n[GLOBAL ERROR HANDLER] [${req.method}] ${req.path}`);
  console.error(`Message : ${err.message}`);
  // if (process.env.NODE_ENV === 'development') {
  //   console.error(`Stack   : ${err.stack}`);
  // }

  if (err.message === 'Not allowed by CORS') {
    return sendError(
      res,
      'Akses ditolak oleh kebijakan CORS',
      `Domain asal (${req.headers.origin || 'Unknown'}) tidak diizinkan mengakses API ini.`,
      'CORS_ACCESS_DENIED',
      403
    );
  }

  return sendError(
    res,
    'Terjadi kesalahan internal pada server',
    err.message,
    'INTERNAL_SERVER_ERROR',
    500
  );
};

export const corsMiddleware = cors(corsOptions);
