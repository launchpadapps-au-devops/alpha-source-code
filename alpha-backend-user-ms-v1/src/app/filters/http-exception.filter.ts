import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { IErrorResponse } from './../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
    
        let exceptionData;
        let errorMessage = '';
        let status;
        if (exception instanceof HttpException) {
          exceptionData = exception.getResponse() as string | object;
          if (Array.isArray(exceptionData.message)) {
            errorMessage = exceptionData.message.join(', ');
          } else {
            errorMessage = exceptionData.message;
          }
          status = exceptionData.statusCode;
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
                details: exceptionData.response?.error || [],
                debug: process.env.NODE_ENV === 'development' ? { stack: exception.stack } : undefined
            }
        };
    
        response.status(status).json(errorResponse);
      }
}
