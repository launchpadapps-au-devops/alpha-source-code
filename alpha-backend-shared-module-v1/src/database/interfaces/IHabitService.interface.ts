import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { Habit } from "../entities";

export interface IHabitService {
  createHabit(data: Partial<Habit>): Promise<Habit>;
  updateHabit(id: number, data: Partial<Habit>): Promise<Habit>;
  bulkUpdateHabit(data: Partial<Habit>[]): Promise<Habit[]>;
  findHabitById(id: number): Promise<Habit>;
  findHabitByIds(ids: number[]): Promise<Habit[]>;
  findHabitByThemeId(themeId: number): Promise<Habit[]>;
  findHabitByThemeIds(themeIds: number[]): Promise<Habit[]>;
  findAllHabits(pagination: PaginationDto, sortingOptions: SortingDto, filters: GenericFilterDto): Promise<{
    data: Habit[],
    totalRecords: number,
    limit?: number,
    page?: number
  }>;
}