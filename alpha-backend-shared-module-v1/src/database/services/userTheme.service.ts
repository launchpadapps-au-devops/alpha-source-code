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

  async updateUserThemes(data: Partial<UserTheme[]>): Promise<UserTheme[]> {
    const userThemes = await UserThemeService.UserThemeRepository.find({
      where: { id: In(data.map(d => d.id)) }
    });

    if (!userThemes) {
      throw new NotFoundException(`UserThemes not found`);
    }

    userThemes.forEach(userTheme => {
      const updatedData = data.find(d => d.id === userTheme.id);
      Object.assign(userTheme, updatedData);
    });

    await UserThemeService.UserThemeRepository.save(userThemes);
    return userThemes;
  }

  async findUserThemeById(id: string): Promise<UserTheme> {
    return UserThemeService.UserThemeRepository.findOne({
      where: { id },
      relations: ['userLifestylePlan', 'theme', 'userLessons'],
    });
  }

  async findUserThemeByIds(ids: string[]): Promise<UserTheme[]> {
    return UserThemeService.UserThemeRepository.find({
      where: { id: In(ids) },
    });
  }

  async findUserThemeByThemeId(themeId: number): Promise<UserTheme[]> {
    return UserThemeService.UserThemeRepository.find({
      where: { themeId, status: 'ACTIVE' },
      relations: ['theme', 'userLifestylePlan', 'userLessons'],
    });
  }

  async findUserThemesByUserId(userId: string): Promise<UserTheme[]> {
    return UserThemeService.UserThemeRepository.find({
      relations: ['theme', 'theme.lessons', 'userLessons', 'userLessons.lesson'],
      where: { userId, status: 'ACTIVE' },
      order: { theme: { themeCode: 'ASC' } },
    });
  }

  async findUserThemesByUserCategoryIds(userCategoryIds: string[]): Promise<UserTheme[]> {
    return UserThemeService.UserThemeRepository.find({
      relations: ['theme', 'theme.lessons', 'userLessons', 'userLessons.lesson'],
      where: { userCategoryId: In(userCategoryIds), status: 'ACTIVE' },
    });
  }

  async findUserThemesByUserLifestylePlanId(userLifestylePlanId: string): Promise<UserTheme[]> {
    return UserThemeService.UserThemeRepository.find({
      relations: ['theme', 'theme.lessons', 'userLessons', 'userLessons.lesson'],
      where: { userLifestylePlanId, status: 'ACTIVE' },
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
      status: 'ACTIVE',
      ...(searchText ? { name: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<UserTheme> = {
      where,
      relations: ['userLifestylePlan', 'theme', 'userLessons'],
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
