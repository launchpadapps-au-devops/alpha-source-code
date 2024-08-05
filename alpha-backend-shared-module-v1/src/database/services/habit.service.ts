import { Repository, ILike, FindManyOptions, In } from "typeorm";
import { DatabaseModule } from "../index";
import { Habit } from "../entities";
import { NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";
import { IHabitService } from "../interfaces/IHabitService.interface";

class HabitService implements IHabitService {
  static get habitRepository(): Repository<Habit> {
    return DatabaseModule.getRepository(Habit);
  }

  async createHabit(data: Partial<Habit>): Promise<Habit> {
    const habit = new Habit();
    Object.assign(habit, data);
    await HabitService.habitRepository.save(habit);
    return habit;
  }

  async updateHabit(id: number, data: Partial<Habit>): Promise<Habit> {
    const habit = await HabitService.habitRepository.findOne({
      where: { id }
    });

    if (!habit) {
      throw new NotFoundException(`Habit with id ${id} not found`);
    }

    Object.assign(habit, data);
    await HabitService.habitRepository.save(habit);
    return habit;
  }

  async bulkUpdateHabit(data: Partial<Habit>[]): Promise<Habit[]> {
    return HabitService.habitRepository.save(data);
  }

  async findHabitById(id: number): Promise<Habit> {
    return HabitService.habitRepository.findOne({
      where: { id }
    });
  }

  async findHabitByIds(ids: number[]): Promise<Habit[]> {
    return HabitService.habitRepository.find({
      where: { id: In(ids) }
    });
  }

  async findHabitByThemeId(themeId: number): Promise<Habit[]> {
    return HabitService.habitRepository.find({
      where: { themeId },
      relations: ['theme'],
      order: { theme: { themeCode: 'ASC' } }
    });
  }

  async findHabitByThemeIds(themeIds: number[]): Promise<Habit[]> {
    return HabitService.habitRepository.find({
      where: { themeId: In(themeIds) },
      relations: ['theme'],
      order: { theme: { themeCode: 'ASC' } }
    });
  }

  async findAllHabits(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: Habit[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { habitName: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<Habit> = {
      where,
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    const [data, totalRecords] = await HabitService.habitRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }
}

export const habitService = new HabitService();