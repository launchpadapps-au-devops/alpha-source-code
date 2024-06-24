import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SortingDto } from '../dto/sorting.dto';

export const Sorting = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): SortingDto => {
    const request = ctx.switchToHttp().getRequest();
    const { sortField, sortOrder } = request.query;
    return { sortField, sortOrder };
  },
);
