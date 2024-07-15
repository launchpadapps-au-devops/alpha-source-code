import { Repository, ILike, FindManyOptions, In } from "typeorm";
import { DatabaseModule } from "../index";
import { IThemeService } from "../interfaces/ITheme.interface";
import { Theme } from "../entities/theme.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";
import { lessonService } from "./lesson.service";

class ThemeService implements IThemeService {
  static get themeRepository(): Repository<Theme> {
    return DatabaseModule.getRepository(Theme);
  }

  async createTheme(data: Partial<Theme>): Promise<Theme> {
    const theme = new Theme();
    Object.assign(theme, data);
    await ThemeService.themeRepository.save(theme);
    return theme;
  }

  async updateTheme(id: number, data: Partial<Theme>): Promise<Theme> {
    const theme = await ThemeService.themeRepository.findOne({
      where: { id }
    });

    if (!theme) {
      throw new NotFoundException(`Theme with id ${id} not found`);
    }

    if(Object(data).hasOwnProperty('isPublished') && data.isPublished) {
      const lesson = await lessonService.findLessonByIds(theme.lessons.map(l => l.id));
      if(lesson.some(l => !l.isPublished)) {
        throw new BadRequestException('Some lessons are not published');
      }
    }
    
    Object.assign(theme, data);
    await ThemeService.themeRepository.save(theme);
    return theme;
  }

  async bulkUpdateTheme(data: Partial<Theme>[]): Promise<Theme[]> {
    return ThemeService.themeRepository.save(data);
  }

  async findThemeById(id: number): Promise<Theme> {
    return ThemeService.themeRepository.findOne({
      where: { id },
      relations: ['category', 'lessons'],
      select: {
        id: true,
        themeCode: true,
        internalNotes: true,
        name: true,
        description: true,
        propertyTags: [],
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          name: true,
        },
        habits: [],
        lessons: {
          id: true,
          name: true,
        }
      }
    });
  }

  async findThemeByIds(themeIds: number[]): Promise<Theme[]> {
    return ThemeService.themeRepository.find({
      where: { id: In(themeIds) },
    });
  }

  async findAllThemes(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: Theme[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { name: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<Theme> = {
      where,
      relations: ['category', 'lessons'],
      select: {
        id: true,
        themeCode: true,
        internalNotes: true,
        name: true,
        description: true,
        propertyTags: [],
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          name: true,
        },
        habits: [],
        lessons: {
          id: true,
          name: true,
        }
      },
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    };

    const [data, totalRecords] = await ThemeService.themeRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }
}

export const themeService = new ThemeService();