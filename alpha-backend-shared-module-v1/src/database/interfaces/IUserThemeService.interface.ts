import { FindManyOptions, FindOneOptions } from "typeorm";
import { UserDto } from "../dto/user.dto";
import { UserTheme } from "../entities";

export interface IUserThemeService {
  createUserTheme(data: Partial<UserTheme>): Promise<UserTheme>;
  createUserThemes(data: Partial<UserTheme>[]): Promise<UserTheme[]>;
  updateUserTheme(id: string, data: Partial<UserTheme>): Promise<UserTheme>;
  findUserThemeById(id: string): Promise<UserTheme>;
  findUserThemeByIds(ids: string[]): Promise<UserTheme[]>;
  findAllUserThemes(): Promise<{
    data: UserTheme[],
    totalRecords: number
  }>;
}