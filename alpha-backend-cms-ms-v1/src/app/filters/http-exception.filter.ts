import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { IErrorResponse } from './../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let exceptionData;
    let errorMessage = '';
    let status;

    if (exception instanceof HttpException) {
      exceptionData = exception.getResponse() as string | object;
      if (Array.isArray(exceptionData?.message || exceptionData?.error?.message || exceptionData)) {
        errorMessage = exceptionData.message.join(', ');
      } else {
        errorMessage = exceptionData.message || exceptionData.error.message || exceptionData.error || exceptionData.message || 'Internal service error';
      }
      status = exception.getStatus();
    } else if (exception instanceof Error && exception.name === 'QueryFailedError') {
      errorMessage = exception.message ?? 'Database error';
      status = HttpStatus.BAD_REQUEST;

      // Check if it's a unique constraint violation
      if ((exception as any).code === '23505') { // PostgreSQL unique violation code
        const detail = (exception as any).detail;
        const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/); // Extracts key=value format
        if (match) {
          const [, key, value] = match;
          errorMessage = `A record with the ${key}=${value} already exists.`;
        }
      }
    } else if (!exception.response) {
      errorMessage = 'Internal service error';
      status = 500;
    } else if (exception.response?.data) {
      exceptionData = exception.response.data as IErrorResponse;
      errorMessage = exceptionData.error.message;
      status = exceptionData.statusCode;
    } else {
      exceptionData = exception.response;
      errorMessage = exceptionData.message;
      status = exceptionData.statusCode;
    }

    const errorResponse: IErrorResponse = {
      statusCode: status,
      error: {
        code: status,
        urlPath: request.url,
        timestamp: new Date().toISOString(),
        message: errorMessage,
        details: exceptionData?.response?.error || [],
        debug: process.env.NODE_ENV === 'development' ? { stack: exception.stack } : undefined
      }
    };

    response.status(status).json(errorResponse);
  }
}
