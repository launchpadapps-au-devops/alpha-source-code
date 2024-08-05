import { Repository, ILike, FindManyOptions, In } from "typeorm";
import { DatabaseModule } from "../index";
import { ILessonService } from "../interfaces/ILesson.interface";
import { Lesson } from "../entities";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { GenericFilterDto, PaginationDto, SortOrderType, SortingDto } from "../dto";

class LessonService implements ILessonService {
  static get lessonRepository(): Repository<Lesson> {
    return DatabaseModule.getRepository(Lesson);
  }

  async createLesson(data: Partial<Lesson>): Promise<Lesson> {
    const lesson = new Lesson();
    Object.assign(lesson, data);
    await LessonService.lessonRepository.save(lesson);
    return lesson;
  }

  async updateLesson(id: number, data: Partial<Lesson>): Promise<Lesson> {
    const lesson = await LessonService.lessonRepository.findOne({
      where: { id }
    }); 

    if(lesson.themeId && lesson.themeId !== data.themeId) {
      throw new BadRequestException('Lesson is already associated with a theme');
    }

    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} not found`);
    }

    Object.assign(lesson, data);
    await LessonService.lessonRepository.save(lesson);
    return lesson;
  }

  async bulkUpdateLesson(data: Partial<Lesson>[]): Promise<Lesson[]> {
    const lessons = await LessonService.lessonRepository.find({
      where: { id: In(data.map(d => d.id)) }
    });

    for(const l of data) {
      const lesson = lessons.find(lesson => lesson.id === l.id);
      if(lesson.themeId && (lesson.themeId !== l.themeId)) {
        throw new BadRequestException('Lesson is already associated with a theme');
      }
    }

    return LessonService.lessonRepository.save(data);
  }

  async findLessonById(id: number): Promise<Lesson> {
    return LessonService.lessonRepository.findOne({
      where: { id },
      relations: ['theme', 'category', 'createdBy'],
      select: {
        id: true,
        lessonCode: true,
        themeId: true,
        categoryId: true,
        duration: true,
        points: true,
        lessonTags: [],
        theme: {
          id: true,
          name: true,
          category: {
            id: true,
            name: true,
          },
        },
        category: {
          id: true,
          name: true,
        },
        internalNotes: true,
        coverImage: true,
        name: true,
        description: true,
        screenData: [],
        quizData: [],
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
        updatedBy: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      }
    });
  }

  async findLessonByIds(ids: number[]): Promise<Lesson[]> {
    return LessonService.lessonRepository.find({
      where: { id: In(ids) },
      relations: ['theme', 'category', 'createdBy'],
      select: {
        id: true,
        lessonCode: true,
        themeId: true,
        categoryId: true,
        duration: true,
        points: true,
        lessonTags: [],
        theme: {
          id: true,
          name: true,
          category: {
            id: true,
            name: true,
          },
        },
        category: {
          id: true,
          name: true,
        },
        internalNotes: true,
        coverImage: true,
        name: true,
        description: true,
        screenData: [],
        quizData: [],
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
        updatedBy: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      }
    });
  }

  async findLessonsByThemeIds(themeIds: number[]): Promise<Lesson[]> {
    return LessonService.lessonRepository.find({
      where: { themeId: In(themeIds), status: 'ACTIVE' },
      select: {
        id: true,
        lessonCode: true,
        themeId: true,
        lessonTags: [],
      },
      order: { lessonCode: 'ASC' }
    });
  }
  async findAllLessons(
    pagination: PaginationDto = { page: 1, limit: 10 },
    sorting: SortingDto = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
    filters: GenericFilterDto = {}
  ): Promise<{
    data: Lesson[];
    totalRecords: number;
    limit: number;
    page: number;
  }> {
    const { searchText, ...restFilters } = filters;

    const where: any = {
      ...(searchText ? { lessonName: ILike(`%${searchText}%`) } : {}),
      ...restFilters,
    };

    const findOptions: FindManyOptions<Lesson> = {
      where,
      relations: ['theme', 'category', 'createdBy'],
      order: {
        [sorting.sortField]: sorting.sortOrder,
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      select: {
        id: true,
        lessonCode: true,
        themeId: true,
        categoryId: true,
        duration: true,
        points: true,
        lessonTags: [],
        theme: {
          id: true,
          name: true,
          category: {
            id: true,
            name: true,
          },
        },
        category: {
          id: true,
          name: true,
        },
        internalNotes: true,
        coverImage: true,
        name: true,
        description: true,
        screenData: [],
        quizData: [],
        createdAt: true,
        updatedAt: true,
        createdBy: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
        updatedBy: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      }
    };

    const [data, totalRecords] = await LessonService.lessonRepository.findAndCount(findOptions);

    return {
      data,
      totalRecords,
      limit: pagination.limit,
      page: pagination.page,
    };
  }
}

export const lessonService = new LessonService();