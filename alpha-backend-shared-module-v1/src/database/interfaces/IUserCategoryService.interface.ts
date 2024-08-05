import { FindManyOptions, FindOneOptions } from "typeorm";
import { UserDto } from "../dto/user.dto";
import { UserCategory } from "../entities";

export interface IUserCategoryService {
  createUserCategory(data: Partial<UserCategory>): Promise<UserCategory>;
  createUserCategories(data: Partial<UserCategory>[]): Promise<UserCategory[]>;
  updateUserCategory(id: string, data: Partial<UserCategory>): Promise<UserCategory>;
  findUserCategoryById(id: string): Promise<UserCategory>;
  findUserCategoryByIds(ids: string[]): Promise<UserCategory[]>;
  findUserCategoryByCategoryId(categoryId: number): Promise<UserCategory[]>;
  findAllUserCategories(): Promise<{
    data: UserCategory[],
    totalRecords: number
  }>;
}