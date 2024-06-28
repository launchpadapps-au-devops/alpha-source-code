import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISuccessResponse } from './../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ISuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ISuccessResponse<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          data: data['data'] || null,
          message: data['message'] || 'Success',
          meta: data['meta'] || {},
          statusCode: context.switchToHttp().getResponse().statusCode,
        }
      })
    );
  }
}
