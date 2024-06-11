import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const httpResponse: Response = httpContext.getResponse();

    return next.handle().pipe(
      map(responseData => {
          return {
            statusCode: httpResponse.statusCode,
            message: 'Success',
            data: responseData?.data || responseData,
            metadata: responseData?.metadata || {},
          };
        }),
    );
  }
}
