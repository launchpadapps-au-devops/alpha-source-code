import { Repository, In, FindManyOptions, ILike } from "typeorm";
import { DatabaseModule } from "../index";
import { UserHabit } from "../entities/userHabit.entity";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";
import { UserHabitProgress } from "../entities";

class UserHabitService {
  static get UserHabitRepository(): Repository<UserHabit> {
    return DatabaseModule.getRepository(UserHabit);
  }

  static get UserHabitProgressRepository(): Repository<UserHabitProgress> {
    return DatabaseModule.getRepository(UserHabitProgress);
  }

  async createUserHabit(data: Partial<UserHabit>): Promise<UserHabit> {
    const userHabit = new UserHabit();
    Object.assign(userHabit, data);
    await UserHabitService.UserHabitRepository.save(userHabit);
    return userHabit;
  }

  async createUserHabits(data: Partial<UserHabit>[]): Promise<UserHabit[]> {
    const userHabits = data.map(d => {
      const userHabit = new UserHabit();
      Object.assign(userHabit, d);
      return userHabit;
    });

    await UserHabitService.UserHabitRepository.save(userHabits);
    return userHabits;
  }

  async updateUserHabit(id: string, data: Partial<UserHabit>): Promise<UserHabit> {
    const userHabit = await UserHabitService.UserHabitRepository.findOne({
      where: { id }
    });

    if (!userHabit) {
      throw new NotFoundException(`UserHabit with id ${id} not found`);
    }

    Object.assign(userHabit, data);
    await UserHabitService.UserHabitRepository.save(userHabit);
    return userHabit;
  }

  async updateUserHabits(data: Partial<UserHabit []>): Promise<UserHabit[]> {
    const userHabits = await UserHabitService.UserHabitRepository.find({
      where: { id: In(data.map(d => d.id)) }
    });

    if (!userHabits) {
      throw new NotFoundException(`UserHabits not found`);
    }

    userHabits.forEach(userHabit => {
      const updatedData = data.find(d => d.id === userHabit.id);
      Object.assign(userHabit, updatedData);
    });

    await UserHabitService.UserHabitRepository.save(userHabits);
    return userHabits;
  }

  async findUserHabitById(id: string): Promise<UserHabit> {
    return UserHabitService.UserHabitRepository.findOne({
      where: { id },
      relations: ['userTheme', 'habit'],
    });
  }

  async findUserHabitByIds(ids: string[]): Promise<UserHabit[]> {
    return UserHabitService.UserHabitRepository.find({
      where: { id: In(ids) },
    });
  }

  async findUserHabitsByUserId(userId: string, filters: GenericFilterDto = {}): Promise<UserHabit[]> {
    return UserHabitService.UserHabitRepository.find({
      where: { 
        userId, 
        ...filters
        },
      relations: ['habit', 'habit.theme'],
      select: {
        id: true,
        status: true,
        userId: true,
        userThemeId: true,
        userHabitProgress: true,
        habit: {
          id: true,
          themeId: true,
          theme: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true
          },
          order: true,
          name: true,
          timeAllocation: true,
          pointAllocation: true,
          instructions: true,
          meta: {},
          createdAt: true,
          updatedAt: true
        },
        isCompleted: true,
        completedAt: true,
        startedAt: true,
        targetDate: true,
        pointsEarned: true,
        updatedAt: true,
        createdAt: true
      }
    });
  }

  async findUserHabitsByUserThemeId(userThemeId: string): Promise<UserHabit[]> {
    return UserHabitService.UserHabitRepository.find({
      where: { userThemeId, status: 'ACTIVE' },
      relations: ['userTheme', 'userTheme.theme', 'habit'],
    });
  }

  async findAllUserHabits(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: UserHabit[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { 'habit.name': ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<UserHabit> = {
      where,
      relations: ['userTheme', 'habit'],
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    const [data, totalRecords] = await UserHabitService.UserHabitRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  async createUserHabitProgressBulk(data: Partial<UserHabitProgress>[]): Promise<UserHabitProgress[]> {
    const userHabitProgress = data.map(d => {
      const userHabitProgress = new UserHabitProgress();
      Object.assign(userHabitProgress, d);
      return userHabitProgress;
    });

    await UserHabitService.UserHabitProgressRepository.save(userHabitProgress);
    return userHabitProgress;
  }

  async updateUserHabitProgress(id: string, data: Partial<UserHabitProgress>): Promise<UserHabitProgress> {
    const userHabitProgress = await UserHabitService.UserHabitProgressRepository.findOne({
      where: { id },
    });

    if (!userHabitProgress) {
      throw new NotFoundException(`UserHabitProgress with id ${id} not found`);
    }

    Object.assign(userHabitProgress, data);
    await UserHabitService.UserHabitProgressRepository.save(userHabitProgress);
    return userHabitProgress;
  }

  async findUserHabitProgressById(id: string): Promise<UserHabitProgress> {
    return UserHabitService.UserHabitProgressRepository.findOne({
      where: { id },
    });
  }

  async findUserHabitProgressByUserHabitId(userHabitId: string): Promise<UserHabitProgress[]> {
    return UserHabitService.UserHabitProgressRepository.find({
      where: { userHabitId, status: 'ACTIVE' },
    });
  }
}

export const userHabitService = new UserHabitService();