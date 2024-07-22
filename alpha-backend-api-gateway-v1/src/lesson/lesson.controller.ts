
import { Body, Controller, Get, Headers, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CreateLessonDto, UpdateLessonDto, LessonResponseDto } from './lesson.dto';
import { LessonService } from './lesson.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { Platforms } from 'src/auth/platform.decorator';

@ApiTags('Lesson')
@ApiExtraModels(CreateLessonDto, UpdateLessonDto, LessonResponseDto)
@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiBody({type: CreateLessonDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lesson added successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                    },
                },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/')
    async createLesson(
        @Request() req,
        @Body() payload: Partial<CreateLessonDto>
    ) {
        return this.lessonService.createLesson(payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiBody({ 
        description: 'Array of lessons to be updated',
        type: [UpdateLessonDto]
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lessons updated sucessfully' },
                data: { type: 'string', example: '1,2,3' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/bulk')
    async bulkUpdateLesson(
        @Request() req,
        @Body() payload: UpdateLessonDto[]
    ) {
        return this.lessonService.bulkUpdateLesson(payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'id',
        description: 'Lesson ID',
        type: 'number',
        required: true
    })
    @ApiBody({ type: UpdateLessonDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lesson updated sucessfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: '1' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('/:id')
    async updateLesson(
        @Request() req,
        @Param('id') id: number,
        @Body() payload: UpdateLessonDto
    ) {
        return this.lessonService.updateLesson(id, payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'id',
        description: 'Lesson ID',
        type: 'number',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lesson fetched sucessfully' },
                data: { $ref: getSchemaPath(LessonResponseDto) },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/:id')
    async findLessonById(
        @Request() req,
        @Param('id') id: number
    ) {
        return this.lessonService.findLessonById(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiQuery({
        name: 'page',
        type: 'number',
        required: false
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false
    })
    @ApiQuery({
        name: 'sortField',
        type: 'string',
        required: false
    })
    @ApiQuery({
        name: 'sortOrder',
        type: 'string',
        required: false
    })
    @ApiQuery({
        name: 'themeId',
        type: 'number',
        required: false
    })
    @ApiQuery({
        name: 'categoryId',
        type: 'number',
        required: false
    })
    @ApiQuery({
        name: 'status',
        type: 'string',
        required: false
    })
    @ApiQuery({
        name: 'isPublished',
        type: 'boolean',
        required: false
    })
    @ApiQuery({
        name: 'searchText',
        type: 'string',
        required: false
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lessons fetched sucessfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(LessonResponseDto) } },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get()
    async findAllLessons(
        @Request() req
    ) {
        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;
        return this.lessonService.findAllLessons(
            {
                page: Number(page),
                limit: Number(limit),
            },
            {
                sortField,
                sortOrder: sortOrder as 'ASC' | 'DESC'
            },
            { 
                ...filters,
            }
        );
    }
}
