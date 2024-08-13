import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { UserHealthData } from "../entities";

export interface IUserHealthDataService {
  createUserHealthData(data: Partial<UserHealthData>): Promise<UserHealthData>;
  updateUserHealthData(id: string, data: Partial<UserHealthData>): Promise<UserHealthData>;
  bulkUpdateUserHealthData(data: Partial<UserHealthData>[]): Promise<UserHealthData[]>;
  findUserHealthDataById(id: string): Promise<UserHealthData>;
  findUserHealthDataByIds(ids: string[]): Promise<UserHealthData[]>;
  findUserHealthDataByUserId(userId: string): Promise<UserHealthData[]>;
  findAllUserHealthData(
    pagination: PaginationDto,
    sorting: SortingDto,
    filters: GenericFilterDto
  ): Promise<{
    data: UserHealthData[];
    totalRecords: number;
    limit?: number;
    page?: number;
  }>;
}