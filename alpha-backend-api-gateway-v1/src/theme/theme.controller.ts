import { Body, Controller, Get, Headers, NotFoundException, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Theme, USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CreateThemeDto, UpdateThemeDto, ThemeResponseDto } from './theme.dto';
import { ThemeService } from './theme.service';
import { LessonService } from 'src/lesson/lesson.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { Platforms } from 'src/auth/platform.decorator';

@ApiTags('Theme')
@ApiExtraModels(CreateThemeDto, UpdateThemeDto)
@ApiExtraModels(ThemeResponseDto)
@Controller('theme')
export class ThemeController {
    constructor(
        private readonly lessonService: LessonService,
        private readonly themeService: ThemeService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                themeData: { type: 'object', $ref: getSchemaPath(CreateThemeDto) },
                lessonData: { type: 'array', example: [1, 2 ,3] },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Theme added successfully' },
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
    async createTheme(
        @Request() req,
        @Body() payload: {
            themeData: CreateThemeDto,
            lessonData: number [],
        }
    ) {
        const { data: lessons = [] } = await this.lessonService.findLessonByIds(payload.lessonData);
        if(lessons.length !== payload.lessonData.length) {
            throw new NotFoundException('Some lessons not found');
        }

        if(lessons.some((l) => l.themeId)) {
            throw new NotFoundException('Some lessons already have theme assigned');
        }

        const theme = await this.themeService.createTheme(payload.themeData, req.user);
        
        await this.lessonService.bulkUpdateLesson(
            lessons?.map(lesson => ({ ...lesson, themeId: theme.data.id })),
        )

        return theme;
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'id',
        description: 'Theme ID',
        type: 'number',
        required: true
    })
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                themeData: { type: 'object', $ref: getSchemaPath(UpdateThemeDto) },
                lessonData: { type: 'array', example: [] },
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Theme updated sucessfully' },
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
    async updateTheme(
        @Request() req,
        @Param('id') id: number,
        @Body() payload: {
            themeData: Partial<Theme>,
            lessonData: number [],
        }
    ) {
        const existingTheme = await this.themeService.findThemeById(id);

        const { data: lessons = [] } = await this.lessonService.findLessonByIds(payload.lessonData);
        if(lessons.length !== payload.lessonData.length) {
            throw new NotFoundException('Some lessons not found');
        }

        if(lessons.some((l) => l.themeId && l.themeId !== id)) {
            throw new NotFoundException('Some lessons already have theme assigned');
        }

        await this.lessonService.bulkUpdateLesson(
            lessons.map(lesson => ({ ...lesson, themeId: id })),
        )

        const lessonIds = lessons.map(l => l.id);
        const removeLessonIds = existingTheme.data.lessons.filter(l => !lessonIds.includes(l.id)).map((l) => l.id);
        const { data: lessonsToRemove = [] } = await this.lessonService.findLessonByIds(removeLessonIds);

        await this.lessonService.bulkUpdateLesson(
            lessonsToRemove.map(lesson => ({ ...lesson, themeId: null })),
        )

        return this.themeService.updateTheme(id, payload.themeData, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'id',
        description: 'Theme ID',
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
                message: { type: 'string', example: 'Theme fetched sucessfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(ThemeResponseDto) } },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/:id')
    async findThemeById(
        @Request() req,
        @Param('id') id: number
    ) {
        return this.themeService.findThemeById(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiQuery({
        name: 'categoryId',
        type: 'number',
        required: false,
        example: 1,
    })
    @ApiQuery({
        name: 'page',
        type: 'number',
        required: false,
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        type: 'number',
        required: false,
        example: 10,
    })
    @ApiQuery({
        name: 'sortField',
        type: 'string',
        required: false,
        example: 'createdAt',
    })
    @ApiQuery({
        name: 'sortOrder',
        type: 'string',
        required: false,
        example: 'DESC',
    })
    @ApiQuery({
        name: 'searchText',
        type: 'string',
        required: false,
        example: 'Theme Name',
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Themes fetched sucessfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(ThemeResponseDto) } },
                meta: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                        totalRecords: { type: 'number', example: 1 },
                        totalPages: { type: 'number', example: 1 },
                    },
                },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/')
    async findAllThemes(
        @Request() req
    ) {
        const { page, limit, sortField, sortOrder, searchText } = req.query;
        return this.themeService.findAllThemes(
            { page, limit },
            { sortField, sortOrder },
            { searchText }
        );
    }
}
