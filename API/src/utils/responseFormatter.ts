import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

interface ApiErrorResponse {
  success: boolean;
  message: string;
  error_detail: any;
  code: string;
  timestamp: string;
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode: number = 200
): Response => {
  const responseBody: ApiResponse<T> = {
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
  errorMessage = 'INTERNAL_SERVER_ERROR',
  statusCode = 500
): Response => {
  const errorResponseBody: ApiErrorResponse = {
    success: false,
    message,
    error_detail: errorDetail,
    code: errorMessage,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(errorResponseBody);
};
