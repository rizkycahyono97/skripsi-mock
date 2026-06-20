import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  code: string | number;
  message: string;
  data: T | null;
  error?: any;
  error_detail?: any;
  timestamp: string;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode: number = 200
): Response => {
  const responseBody: ApiResponse<T> = {
    code: statusCode,
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(responseBody);
};

export const sendError = (
  res: Response,
  message: string,
  errorDetail: any = null,
  errorMessage: string | number = 'INTERNAL_SERVER_ERROR',
  statusCode = 500
): Response => {
  const errorResponseBody: ApiResponse = {
    code: statusCode,
    success: false,
    message,
    error: errorMessage,
    error_detail: errorDetail ? errorDetail.toString() : null,
    data: null,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(errorResponseBody);
};
