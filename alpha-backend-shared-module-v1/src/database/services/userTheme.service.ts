import { Repository, In, FindManyOptions, ILike } from "typeorm";
import { DatabaseModule } from "../index";
import { IUserThemeService } from "../interfaces/IUserThemeService.interface";
import { UserTheme } from "../entities/userTheme.entity";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";

class UserThemeService implements IUserThemeService {
  static get UserThemeRepository(): Repository<UserTheme> {
    return DatabaseModule.getRepository(UserTheme);
  }

  async createUserTheme(data: Partial<UserTheme>): Promise<UserTheme> {
    const userTheme = new UserTheme();
    Object.assign(userTheme, data);
    await UserThemeService.UserThemeRepository.save(userTheme);
    return userTheme;
  }

  async createUserThemes(data: Partial<UserTheme>[]): Promise<UserTheme[]> {
    const userThemes = data.map((userThemeData) => {
      const userTheme = new UserTheme();
      Object.assign(userTheme, userThemeData);
      return userTheme;
    });

    await UserThemeService.UserThemeRepository.save(userThemes);
    return userThemes;
  }
  
  async updateUserTheme(id: string, data: Partial<UserTheme>): Promise<UserTheme> {
    const userTheme = await UserThemeService.UserThemeRepository.findOne({
      where: { id }
    });

    if (!userTheme) {
      throw new NotFoundException(`UserTheme with id ${id} not found`);
    }

    Object.assign(userTheme, data);
    await UserThemeService.UserThemeRepository.save(userTheme);
    return userTheme;
  }

  async findUserThemeById(id: string): Promise<UserTheme> {
    return UserThemeService.UserThemeRepository.findOne({
      where: { id },
      relations: ['userLifestylePlan', 'theme', 'userLessonProgresses'],
    });
  }

  async findUserThemeByIds(ids: string[]): Promise<UserTheme[]> {
    return UserThemeService.UserThemeRepository.find({
      where: { id: In(ids) },
    });
  }

  async findUserThemesByUserId(userId: string): Promise<UserTheme[]> {
    return UserThemeService.UserThemeRepository.find({
      relations: ['theme', 'userLessons', 'userLessons.lesson'],
      where: { userId },
    });
  }

  async findAllUserThemes(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: UserTheme[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { name: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<UserTheme> = {
      where,
      relations: ['userLifestylePlan', 'theme', 'userLessonProgresses'],
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    const [data, totalRecords] = await UserThemeService.UserThemeRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }
}

export const userThemeService = new UserThemeService();
