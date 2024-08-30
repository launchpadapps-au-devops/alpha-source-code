import { Repository, ILike, FindManyOptions, In, MoreThan, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { DatabaseModule } from "../index";
import { UserHealthData } from "../entities";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";
import { IUserHealthDataService } from "../interfaces/IUserHealthData.interface";


class UserHealthDataService {
  static get userHealthDataRepository(): Repository<UserHealthData> {
    return DatabaseModule.getRepository(UserHealthData);
  }

  async createUserHealthData(data: Partial<UserHealthData>): Promise<UserHealthData> {
    const userHealthData = new UserHealthData();
    Object.assign(userHealthData, data);
    await UserHealthDataService.userHealthDataRepository.save(userHealthData);
    return userHealthData;
  }

  async bulkAddUserHealthData(data: Partial<UserHealthData>[]): Promise<UserHealthData[]> {
    return UserHealthDataService.userHealthDataRepository.save(data);
  }

  async updateUserHealthData(id: string, data: Partial<UserHealthData>): Promise<UserHealthData> {
    const userHealthData = await UserHealthDataService.userHealthDataRepository.findOne({
      where: { id }
    });

    if (!userHealthData) {
      throw new NotFoundException(`UserHealthData with id ${id} not found`);
    }

    Object.assign(userHealthData, data);
    await UserHealthDataService.userHealthDataRepository.save(userHealthData);
    return userHealthData;
  }

  async bulkUpdateUserHealthData(data: Partial<UserHealthData>[]): Promise<UserHealthData[]> {
    return UserHealthDataService.userHealthDataRepository.save(data);
  }

  async findUserHealthDataById(id: string): Promise<UserHealthData> {
    return UserHealthDataService.userHealthDataRepository.findOne({
      where: { id }
    });
  }

  async findUserHealthDataByIds(ids: string[]): Promise<UserHealthData[]> {
    return UserHealthDataService.userHealthDataRepository.find({
      where: { id: In(ids) }
    });
  }

  async findUserHealthDataByUserId(userId: string): Promise<UserHealthData[]> {
    return UserHealthDataService.userHealthDataRepository.find({
      where: { userId }
    });
  }

  async findAllUserHealthData(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: UserHealthData[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, fromDate, toDate, ...restFilters } = filters;
  
    const where: any = {
      ...(searchText ? { userId: ILike(`%${searchText}%`) } : {}),
      ...(fromDate ? { createdAt: MoreThanOrEqual(fromDate) }: {}),
      ...(toDate ? { createdAt: LessThanOrEqual(toDate) }: {}),
      ...restFilters,
    };
  
    const findOptions: FindManyOptions<UserHealthData> = {
      where,
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
    };
  
    // Check if pagination.limit is explicitly provided
    if (pagination?.limit !== undefined && pagination?.page !== undefined) {
      findOptions.take = pagination.limit;
      findOptions.skip = (pagination.page - 1) * pagination.limit;
    }

  
    const [data, totalRecords] = await UserHealthDataService.userHealthDataRepository.findAndCount(findOptions);
    
    return { 
      data, 
      totalRecords, 
      limit: pagination?.limit ?? totalRecords, 
      page: pagination?.page ?? 1 
    };
  }
  
}

export const userHealthDataService = new UserHealthDataService();