import { Repository, In, FindManyOptions, ILike } from "typeorm";
import { DatabaseModule } from "../index";
import { IUserPlanService } from "../interfaces/IUserPlan.interface";
import { UserPlan } from "../entities/userPlan.entity";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";

class UserPlanService implements IUserPlanService {
  static get UserPlanRepository(): Repository<UserPlan> {
    return DatabaseModule.getRepository(UserPlan);
  }

  async createUserPlan(data: Partial<UserPlan>): Promise<UserPlan> {
    const userPlan = new UserPlan();
    Object.assign(userPlan, data);
    await UserPlanService.UserPlanRepository.save(userPlan);
    return userPlan;
  }

  async updateUserPlan(id: string, data: Partial<UserPlan>): Promise<UserPlan> {
    const UserPlan = await UserPlanService.UserPlanRepository.findOne({
      where: { id }
    });

    if (!UserPlan) {
      throw new NotFoundException(`UserPlan with id ${id} not found`);
    }

    Object.assign(UserPlan, data);
    await UserPlanService.UserPlanRepository.save(UserPlan);
    return UserPlan;
  }

  async findUserPlanById(id: string): Promise<UserPlan> {
    return UserPlanService.UserPlanRepository.findOne({
      where: { id },
      relations: ['user', 'plan', 'userThemes'],
    });
  }

  async findUserPlanByIds(ids: string[]): Promise<UserPlan[]> {
    return UserPlanService.UserPlanRepository.find({
      where: { id: In(ids) },
    });
  }

  async findAllUserPlans(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: UserPlan[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { name: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<UserPlan> = {
      where,
      relations: ['user', 'plan', 'userThemes'],
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    const [data, totalRecords] = await UserPlanService.UserPlanRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }
}

export const userPlanService = new UserPlanService();
