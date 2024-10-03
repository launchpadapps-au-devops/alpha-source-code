import { Repository, In, FindManyOptions, ILike } from "typeorm";
import { DatabaseModule } from "../index";
import { IUserThemeService } from "../interfaces/IUserThemeService.interface";
import { UserTheme } from "../entities/userTheme.entity";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";
import { UserCategory } from "../entities";

class UserCategoryService {
  static get UserCategoryRepository(): Repository<UserCategory> {
    return DatabaseModule.getRepository(UserCategory);
  }

  async createUserCategory(data: Partial<UserCategory>): Promise<UserCategory> {
    const userCategory = new UserCategory();
    Object.assign(userCategory, data);
    await UserCategoryService.UserCategoryRepository.save(userCategory);
    return userCategory;
  }

  async createUserCategories(data: Partial<UserCategory>[]): Promise<UserCategory[]> {
    const userCategories = data.map((userCategoryData) => {
      const userCategory = new UserCategory();
      Object.assign(userCategory, userCategoryData);
      return userCategory;
    });

    await UserCategoryService.UserCategoryRepository.save(userCategories);
    return userCategories;
  }
  
  async updateUserCategory(id: string, data: Partial<UserCategory>): Promise<UserCategory> {
    const userCategory = await UserCategoryService.UserCategoryRepository.findOne({
      where: { id }
    });

    if (!userCategory) {
      throw new NotFoundException(`UserCategory with id ${id} not found`);
    }

    Object.assign(userCategory, data);
    await UserCategoryService.UserCategoryRepository.save(userCategory);
    return userCategory;
  }

  async updateUserCategories(data: Partial<UserCategory[]>): Promise<UserCategory[]> {
    const userCategories = await UserCategoryService.UserCategoryRepository.find({
      where: { id: In(data.map(d => d.id)) }
    });

    if (!userCategories) {
      throw new NotFoundException(`UserCategories not found`);
    }

    userCategories.forEach(userCategory => {
      const updatedData = data.find(d => d.id === userCategory.id);
      Object.assign(userCategory, updatedData);
    });

    await UserCategoryService.UserCategoryRepository.save(userCategories);
    return userCategories;
  }

  async findUserCategoryById(id: string): Promise<UserCategory> {
    return UserCategoryService.UserCategoryRepository.findOne({
      where: { id },
      relations: ['userLifestylePlan', 'category', 'userLessons'],
    });
  }

  async findUserCategoryByIds(ids: string[]): Promise<UserCategory[]> {
    return UserCategoryService.UserCategoryRepository.find({
      where: { id: In(ids) },
      relations: ['category'],
    });
  }

  async findUserCategoryByCategoryId(categoryId: number): Promise<UserCategory[]> {
    return UserCategoryService.UserCategoryRepository.find({
      where: { categoryId, status: 'ACTIVE' },
      relations: ['category', 'userLifestylePlan', 'userLessons'],
    });
  }

  async findUserCategoriesByUserId(userId: string): Promise<UserCategory[]> {
    return UserCategoryService.UserCategoryRepository.find({
      relations: ['category'],
      where: { userId, status: 'ACTIVE' },
      order: { category: { id: 'ASC' } },
    });
  }

  async findUserCategoriesByUserLifestylePlanId(userLifestylePlanId: string): Promise<UserCategory[]> {
    return UserCategoryService.UserCategoryRepository.find({
      relations: ['category', 'category.lessons', 'userLessons', 'userLessons.lesson'],
      where: { userLifestylePlanId, status: 'ACTIVE' },
    });
  }
}

export const userCategoryService = new UserCategoryService();