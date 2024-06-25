import { SelectQueryBuilder } from "typeorm";
import { PaginationDto } from "../dto/pagination.dto";
import { SortingDto } from "../dto/sorting.dto";
import { GenericFilterDto } from "../dto/filter.dto";

function isUUID(value: string): boolean {
  // Basic UUID v4 pattern check - adjust regex as necessary
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidPattern.test(value);
}

export class PaginationUtil {
    static paginate(queryBuilder: any, { page = 1, limit = 10 }: PaginationDto) {
      const skip = (page - 1) * limit;
      return queryBuilder.skip(skip).take(limit);
    }
  
    static sort(queryBuilder: any, { sortField = 'updatedAt', sortOrder = 'ASC' }: SortingDto) {
      return queryBuilder.orderBy(`${queryBuilder.alias}.${sortField}`, sortOrder);
    }

    static applyFilters<T>(queryBuilder: SelectQueryBuilder<T>, filters: GenericFilterDto) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string' && !isUUID(value)) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} ILIKE :value`, { value: `%${value}%` });
          } else {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :value`, { value });
          }
        }
      });
    }
  }
  