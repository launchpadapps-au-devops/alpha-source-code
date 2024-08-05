import { UserHabit } from "../entities";
import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";

export interface IUserHabitService {
  createUserHabit(data: Partial<UserHabit>): Promise<UserHabit>;
  createUserHabits(data: Partial<UserHabit>[]): Promise<UserHabit[]>;
  updateUserHabit(id: string, data: Partial<UserHabit>): Promise<UserHabit>;
  findUserHabitById(id: string): Promise<UserHabit>;
  findUserHabitByIds(ids: string[]): Promise<UserHabit[]>;
  findUserHabitsByUserId(userId: string): Promise<UserHabit[]>;
  findUserHabitsByUserThemeId(userThemeId: string): Promise<UserHabit[]>;
  findAllUserHabits(pagination: PaginationDto, sorting: SortingDto, filters: GenericFilterDto): Promise<{
    data: UserHabit[];
    totalRecords: number;
    limit: number;
    page: number;
  }>;
}