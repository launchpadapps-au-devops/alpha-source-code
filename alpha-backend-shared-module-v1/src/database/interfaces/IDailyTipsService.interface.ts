import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { DailyTips } from "../entities";

export interface IDailyTipsService {
  addDailyTips(data: Partial<DailyTips>): Promise<DailyTips>;
  findDailyTipsByDay(day: number): Promise<DailyTips>;
  findAllDailyTips(
    pagination: PaginationDto,
    sortOptions: SortingDto,
    filters: GenericFilterDto,
  ): Promise<{
    data: DailyTips[],
    totalRecords: number,
    limit?: number,
    page?: number
  }>;
}