import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GenericFilterDto } from '../dto/filter.dto';

export const Filters = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): GenericFilterDto => {
    const request = ctx.switchToHttp().getRequest();
    // Extract and return only filter-related parameters, excluding known pagination/sorting params
    const { page, limit, sortField, sortOrder, ...filters } = request.query;
    return filters;
  },
);
