import { Repository, In, FindManyOptions, ILike } from "typeorm";
import { DatabaseModule } from "../index";
import { IUserPlanService } from "../interfaces/IUserPlan.interface";
import { UserPlan } from "../entities/userPlan.entity";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";
import { UserMealLog } from "../entities/userMeal.entity";

class UserMealLogService {
  static get UserMealLogRepository(): Repository<UserMealLog> {
    return DatabaseModule.getRepository(UserMealLog);
  }

  async createUserMealLog(data: Partial<UserMealLog>): Promise<UserMealLog> {
    const userMealLog = new UserMealLog();
    Object.assign(userMealLog, data);
    await UserMealLogService.UserMealLogRepository.save(userMealLog);
    return userMealLog;
  }

  async updateUserMealLog(id: string, data: Partial<UserMealLog>): Promise<UserMealLog> {
    const UserMealLog = await UserMealLogService.UserMealLogRepository.findOne({
      where: { id }
    });

    if (!UserMealLog) {
      throw new NotFoundException(`UserMealLog with id ${id} not found`);
    }

    Object.assign(UserMealLog, data);
    await UserMealLogService.UserMealLogRepository.save(UserMealLog);
    return UserMealLog;
  }

  async findUserMealLogById(id: string): Promise<UserMealLog> {
    return UserMealLogService.UserMealLogRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findUserMealLogByIds(ids: string[]): Promise<UserMealLog[]> {
    return UserMealLogService.UserMealLogRepository.find({
      where: { id: In(ids) },
    });
  }

  async findUserMealLogsByUserId(userId: string): Promise<UserMealLog> {
    return UserMealLogService.UserMealLogRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async findAllUserMealLogs(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: UserMealLog[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { name: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<UserMealLog> = {
      where,
      relations: ['user'],
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };
    
    const [data, totalRecords] = await UserMealLogService.UserMealLogRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }
}

export const userMealLogService = new UserMealLogService();
