import { Body, Controller, Get, Headers, NotFoundException, Param, Post, Put, Query, Request } from '@nestjs/common';
import { SortOrderType } from '@launchpadapps-au/alpha-shared';
import { LessonService } from './lesson.service';
import { Lesson } from '@launchpadapps-au/alpha-shared';

@Controller('/lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ) { }

     @Post()
    async createLesson(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Lesson>
    ) {
        const lesson = await this.lessonService.createLesson(data, { userId: reqUserId });
        return {
            message: `Lesson ${data.name} created successfully`,
            data: {
                id: lesson.id,
            },
        }
    }

    @Post('/bulk')
    async bulkUpdateLesson(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Lesson>[]
    ) {
        const lessons = await this.lessonService.bulkUpdateLesson(data, { userId: reqUserId });
        return {
            message: `${lessons.length} lessons added/updated successfully`,
            data: {
                ids: lessons.map(c => c.id).join(','),
            },
        }
    }


    @Get('/bulk')
    async findLessonByIds(
        @Query('lessonIds') lessonIds: string
    ) {
        const lessons = await this.lessonService.findLessonByIds(lessonIds.split(',').map(Number));
        return {
            message: `${lessons.length} lessons fetched successfully`,
            data: lessons,
        }
    }

    @Put('/:lessonId')
    async updateLesson(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<Lesson>,
        @Param('lessonId') lessonId: number
    ) {
        const lesson = await this.lessonService.updateLesson(lessonId, data, { userId: reqUserId });
        return {
            message: `Lesson ${lesson.name} updated successfully`,
            data: {
                id: lesson.id,
            },
        }
    }

    @Get('/:lessonId')
    async findLessonById(
        @Headers('x-request-userId') reqUserId: string,
        @Param('lessonId') lessonId: number
    ) {
        const lesson = await this.lessonService.findLessonById(lessonId);
        if(!lesson) {
            throw new NotFoundException(`Lesson with id ${lessonId} not found`);
        }
        
        return {
            message: `Lesson ${lesson?.name} fetched successfully`,
            data: lesson,
        }
    }

    @Get()
    async findAllLessons(
        @Headers('x-request-userId') reqUserId: string,
        @Request() req
    ) {
        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;
        const repsonse = await this.lessonService.findAllLessons(
            {
                page: Number(page),
                limit: Number(limit),
            },
            {
                sortField,
                sortOrder: sortOrder as SortOrderType
            },
            { 
                ...filters,
            }
        );
        return {
            message: `Lessons fetched successfully`,
            data: repsonse.data,
            meta: {
                page: repsonse.page,
                limit: repsonse.limit,
                totalRecords: repsonse.totalRecords,
                totalPages: Math.ceil(repsonse.totalRecords / repsonse.limit)
            }
        }
    }
}
