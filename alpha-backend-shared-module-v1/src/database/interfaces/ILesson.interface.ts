import { GenericFilterDto, PaginationDto, SortingDto } from "../dto";
import { Lesson } from "../entities";

export interface ILessonService {
  createLesson(data: Partial<Lesson>): Promise<Lesson>;
  updateLesson(id: number, data: Partial<Lesson>): Promise<Lesson>;
  bulkUpdateLesson(data: Partial<Lesson>[]): Promise<Lesson[]>;
  findLessonById(id: number): Promise<Lesson>;
  findAllLessons(pagination: PaginationDto, sortingOptions: SortingDto, filters: GenericFilterDto): Promise<{
    data: Lesson[],
    totalRecords: number,
    limit?: number,
    page?: number
  }>;
}