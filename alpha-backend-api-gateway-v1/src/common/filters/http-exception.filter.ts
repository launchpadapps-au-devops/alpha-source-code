import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { IErrorResponse } from '../../interfaces/response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
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

    let debug;
    if (exceptionData) {
      debug = exceptionData.error?.debug;
    } else {
      debug = exception.stack;
    }

    debug = exceptionData.error?.debug || exception.stack;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: errorMessage,
      debug: process.env.NODE_ENV === 'development' ? { stack: debug } : undefined
    });
  }
}