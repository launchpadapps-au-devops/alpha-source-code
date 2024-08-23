import { Repository, In, FindManyOptions, ILike } from "typeorm";
import { DatabaseModule } from "../index";
import { IUserLessonService } from "../interfaces/IUserLessonService.interface";
import { UserLesson } from "../entities/userLesson.entity";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";

class UserLessonService implements IUserLessonService {
  static get UserLessonRepository(): Repository<UserLesson> {
    return DatabaseModule.getRepository(UserLesson);
  }

  async createUserLesson(data: Partial<UserLesson>): Promise<UserLesson> {
    const userLesson = new UserLesson();
    Object.assign(userLesson, data);
    await UserLessonService.UserLessonRepository.save(userLesson);
    return userLesson;
  } 

  async createUserLessons(data: Partial<UserLesson>[]): Promise<UserLesson[]> {
    const userLessons = data.map(d => {
      const userLesson = new UserLesson();
      Object.assign(userLesson, d);
      return userLesson;
    });

    await UserLessonService.UserLessonRepository.save(userLessons);
    return userLessons;
  }

  async updateUserLesson(id: string, data: Partial<UserLesson>): Promise<UserLesson> {
    const userLesson = await UserLessonService.UserLessonRepository.findOne({
      where: { id }
    });

    if (!userLesson) {
      throw new NotFoundException(`UserLesson with id ${id} not found`);
    }

    Object.assign(userLesson, data);
    await UserLessonService.UserLessonRepository.save(userLesson);
    return userLesson;
  }

  async findUserLessonById(id: string): Promise<UserLesson> {
    return UserLessonService.UserLessonRepository.findOne({
      where: { id },
      relations: ['userTheme', 'lesson'],
    });
  }

  async findUserLessonByIds(ids: string[]): Promise<UserLesson[]> {
    return UserLessonService.UserLessonRepository.find({
      where: { id: In(ids) },
    });
  }

  async findUserLessonsByUserThemeIds(userThemeIds: string[]): Promise<UserLesson[]> {
    return UserLessonService.UserLessonRepository.find({
      where: { userThemeId: In(userThemeIds), status: 'ACTIVE' },
      relations: ['userTheme', 'userTheme.theme', 'lesson'],
    });
  }

  async findUserLessonsByUserCategoryIds(userCategoryIds: string[]): Promise<UserLesson[]> {
    return UserLessonService.UserLessonRepository.find({
      where: { userCategoryId: In(userCategoryIds), status: 'ACTIVE' },
      relations: ['userTheme', 'userTheme.theme', 'lesson.theme'],
    });
  }

  async findUserLessonsByLifeStylePlanId(userLifeStylePlanId: string): Promise<UserLesson[]> {
    return UserLessonService.UserLessonRepository.find({
      where: { userLifeStylePlanId, status: 'ACTIVE' },
      relations: ['userTheme', 'lesson'],
    });
  }

  async findUserLessonsByUserId(userId: string): Promise<UserLesson[]> {
    return UserLessonService.UserLessonRepository.find({
      where: { userId, status: 'ACTIVE' },
      relations: ['userTheme', 'lesson'],
    });
  }

  async findAllUserLessons(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: UserLesson[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(!!searchText ? { 'lesson.name': ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<UserLesson> = {
      where,
      relations: ['userTheme', 'lesson', 'userCategory', 'userCategory.category'],
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    const [data, totalRecords] = await UserLessonService.UserLessonRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  async getUserLessonFeebacks(
    userId?: string,
    categoryId?: string,
    themeId?: string,
  ) {
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (categoryId) {
      where.userCategory = { categoryId }
    }

    if (themeId) {
      where.userTheme = { themeId };
    }

    return UserLessonService.UserLessonRepository.find({
      where,
      relations: ['userTheme', 'lesson'],
      select: {
        id: true,
        feedback: true,
        feedbackDate: true,
        isPositiveFeedback: true,
        userCategory: {
          category: {
            id: true,
            name: true,
          }
        },
        userTheme: {
          theme: {
            id: true,
            name: true,
          }
        },
      }
    });
  }
}

export const userLessonService = new UserLessonService();
