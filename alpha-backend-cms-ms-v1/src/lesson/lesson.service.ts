import { Injectable } from '@nestjs/common';
import { Lesson, lessonService, GenericFilterDto, PaginationDto, SortingDto, SortOrderType } from '@launchpadapps-au/alpha-shared';

@Injectable()
export class LessonService {

    async createLesson(data: Partial<Lesson>, reqUser = { userId: null }): Promise<Lesson> {
        return lessonService.createLesson({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId,
        });
    }

    async updateLesson(id: number, data: Partial<Lesson>, reqUser = { userId: null }): Promise<Lesson> {
        return lessonService.updateLesson(id, {
            ...data,
            updatedBy: reqUser.userId,
        });
    }

    async bulkUpdateLesson(data: Partial<Lesson>[], reqUser = { userId: null }): Promise<Lesson[]> {
        return lessonService.bulkUpdateLesson(
            data.map(l => ({
                ...l,
                ...(!l.id ? { createdBy: reqUser.userId } : {}),
                updatedBy: reqUser.userId,
            })),
        );
    }

    async findLessonById(id: number): Promise<Lesson> {
        return lessonService.findLessonById(id);
    }

    async findAllLessons(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sorting: SortingDto = { sortField: 'updatedAt', sortOrder: 'DESC' as SortOrderType },
        filters: GenericFilterDto = {}
    ): Promise<{
        data: Lesson[];
        page: number;
        limit: number;
        totalRecords: number;
    }> {
        return lessonService.findAllLessons(pagination, sorting, filters);
    }
}
