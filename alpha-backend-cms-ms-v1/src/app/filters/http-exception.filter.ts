import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { IErrorResponse } from './../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let exceptionData: any;
    let errorMessage = '';
    let status: number;

    // Handle common HttpException cases
    if (exception instanceof HttpException) {
      exceptionData = exception.getResponse() as string | object;
      
      // Handling different formats of exception messages
      if (Array.isArray(exceptionData?.message)) {
        errorMessage = (exceptionData.message as string[]).join(', ');
      } else {
        errorMessage = exceptionData['message'] 
          || exceptionData['error']?.message 
          || exceptionData['error'] 
          || exceptionData 
          || 'Internal service error';
      }

      status = exception.getStatus();
    
    // Handle database errors (like QueryFailedError)
    } else if (exception instanceof Error && exception.name === 'QueryFailedError') {
      errorMessage = exception.message || 'Database error';
      status = HttpStatus.BAD_REQUEST;

      // Handle PostgreSQL unique constraint violation error
      if ((exception as any).code === '23505') { // PostgreSQL unique violation error code
        const detail = (exception as any).detail;

        // Extract key and value from the error message
        const match = detail.match(/\(([^)]+)\)=\(([^)]+)\)/); // Finds "(key)=(value)"
        if (match) {
          const [, key, value] = match;
          errorMessage = `A record with the ${key} '${value}' already exists.`;
        } else {
          errorMessage = 'Unique constraint violation error';
        }
      }
    
    // Handle unknown or unexpected exceptions
    } else if (!exception.response) {
      errorMessage = exception.message || 'Internal service error';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    
    // Handle custom external services or Axios-based responses
    } else if (exception.response?.data) {
      exceptionData = exception.response.data as IErrorResponse;
      errorMessage = exceptionData.error.message;
      status = exceptionData.statusCode;
    
    // Default error handling for other cases
    } else {
      exceptionData = exception.response;
      errorMessage = exceptionData.message || 'Unexpected error';
      status = exceptionData.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // Prepare the error response object
    const errorResponse: IErrorResponse = {
      statusCode: status,
      error: {
        code: status,
        urlPath: request.url,
        timestamp: new Date().toISOString(),
        message: errorMessage,
        details: exceptionData?.error || [],
        debug: process.env.NODE_ENV === 'development' ? { stack: exception.stack } : undefined,
      },
    };

    // Send the response with the appropriate status and message
    response.status(status).json(errorResponse);
  }
}
