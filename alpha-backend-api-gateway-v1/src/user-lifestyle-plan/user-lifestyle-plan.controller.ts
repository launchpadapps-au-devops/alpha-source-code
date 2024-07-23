
import { Request, Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UserLifeStylePlanService } from './user-lifestyle-plan.service';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { SortOrderType, USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { Platforms } from 'src/auth/platform.decorator';
import { GetUserDailyLessonResponseDTO } from './user-lifestyle-plan.dto';


@ApiTags('User Lifestyle Plan')
@Controller('user-lifestyle-plan')
export class UserLifeStylePlanController {
    constructor(
        private readonly userLifeStylePlanService: UserLifeStylePlanService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiBody({ 
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                planId: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
            },
            required: ['userId', 'planId'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User lifestyle plan assigned successfully' },
                data: { type: 'object', example: {} },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Post('/assign')
    async assignUserLifestylePlan(
        @Request() req,
        @Body() payload: {
            userId: string,
            planId: number
        }
    ) {
        await this.userLifeStylePlanService.assignUserLifestylePlan({
            ...payload
        }, req.user);

        return {
            message: 'User lifestyle plan assigned successfully'
        };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User lifestyle plan personalized successfully' },
                data: { type: 'object', example: {} },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Post('/personalize')
    async personalizeUserLifeStylePlan(
        @Request() req,
    ) {
        await this.userLifeStylePlanService.personalizeUserLifeStylePlan({
            userId: req.user.userId
        }, {
            userId: req.user.userId
        });

        return {
            message: 'User lifestyle plan personalized successfully'
        };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiResponse({
       schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User lifestyle plan fetched successfully' },
                data: { 
                    type: 'object',
                    properties: {
                        totalThemes: { type: 'number', example: 5 },
                        themesCompleted: { type: 'number', example: 3 },
                        themeProgress: { type: 'number', example: 60 },
                        totalLessons: { type: 'number', example: 10 },
                        lessonsCompleted: { type: 'number', example: 7 },
                        totalPoints: { type: 'number', example: 100 },
                        planProgress: { type: 'number', example: 70 },
                    }
                },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Get('/progress')
    async getUserLifeStylePlanProgress(
        @Request() req,
    ) {
        return this.userLifeStylePlanService.getUserPlanProgress(req.user.userId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiResponse({
        status: 200,
        type: GetUserDailyLessonResponseDTO,
    })
    @Get('/daily-lessons')
    async getUserDailyLesson(@Request() req): Promise<GetUserDailyLessonResponseDTO> {
        const userId = req.user.userId;
        const lessons = await this.userLifeStylePlanService.getUserDailyLesson({ userId });
        return {
            statusCode: 200,
            message: 'User daily lesson fetched successfully',
            data: lessons,
            meta: {}
        };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({ name: 'userLessonId', type: 'string' })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User lesson completed successfully' },
                data: { 
                    type: 'object', 
                    properties: {
                        userLesson: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                                isCompleted: { type: 'boolean', example: true },
                                completedAt: { type: 'string', example: '2020-10-20T00:00:00.000Z' },
                                progress: { type: 'number', example: 100 },
                            }
                        },
                        userTheme: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                                isCompleted: { type: 'boolean', example: true },
                                completedAt: { type: 'string', example: '2020-10-20T00:00:00.000Z' },
                                progress: { type: 'number', example: 100 },
                            }
                        },
                        userPlan: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                                isCompleted: { type: 'boolean', example: true },
                                completedAt: { type: 'string', example: '2020-10-20T00:00:00.000Z' },
                                progress: { type: 'number', example: 100 },
                            }
                        }
                    }
                },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Post('/daily-lessons/complete/:userLessonId')
    async completeUserLesson(
        @Request() req,
    ) {
        return this.userLifeStylePlanService.completeUserLesson(req.params.userLessonId, {
            userId: req.user.userId
        });
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({ name: 'userLessonId', type: 'string' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                feedback: { type: 'string', example: 'This is a feedback' },
                isPositiveFeedback: { type: 'boolean', example: true },
            },
            required: ['feedback', 'isPositiveFeedback'],
        },
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User lesson feedback submitted successfully' },
                data: { type: 'object', example: {} },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Post('/daily-lessons/feedback/:userLessonId')
    async feedbackUserLesson(
        @Request() req,
        @Body() payload: {
            feedback: string,
            isPositiveFeedback: boolean
        }
    ) {
        await this.userLifeStylePlanService.feedbackUserLesson(req.params.userLessonId, payload, {
            userId: req.user.userId
        });

        return {
            message: 'User lesson feedback submitted successfully',
            data: {
                userLessonId: req.params.userLessonId
            }
        };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({ name: 'userLessonId', type: 'string' })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User lesson feedback fetched successfully' },
                data: { 
                    type: 'object',
                    properties: {
                        feedback: { type: 'string', example: 'This is a feedback' },
                        isPositiveFeedback: { type: 'boolean', example: true },
                        feedbackDate: { type: 'string', example: '2020-10-20T00:00:00.000Z' },
                    }
                },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Get('/daily-lessons/feedback/:userLessonId')
    async getUserLessonFeedback(
        @Request() req,
    ) {
        return this.userLifeStylePlanService.getUserLessonFeedback(req.params.userLessonId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({ name: 'userLessonId', type: 'string' })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User lesson bookmarked successfully' },
                data: { 
                    type: 'object',
                    properties: {
                        userLessonId: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                    }
                },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Post('/daily-lessons/bookmark/:userLessonId')
    async bookmarkUserLesson(
        @Request() req,
    ) {
        await this.userLifeStylePlanService.bookmarkUserLesson(req.params.userLessonId, {
            userId: req.user.userId
        });

        return {
            message: 'User lesson bookmarked successfully',
            data: {
                userLessonId: req.params.userLessonId
            }
        };
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'page', type: 'number', required: false })
    @ApiQuery({ name: 'limit', type: 'number', required: false })
    @ApiQuery({ name: 'sortField', type: 'string', required: false })
    @ApiQuery({ name: 'sortOrder', type: 'string', required: false })
    @ApiQuery({ name: 'searchText', type: 'string', required: false })
    @ApiResponse({
        type: GetUserDailyLessonResponseDTO,
    })
    @Get('/daily-lessons/bookmarked')
    async getBookmarkedUserLesson(
        @Request() req,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('searchText') searchText: string = '',
        @Query('sortField') sortField: string = 'createdAt',
        @Query('sortOrder') sortOrder: string = 'DESC' as SortOrderType,
    ) {
        return this.userLifeStylePlanService.getUserBookmarkedLessons(
            {
                page,
                limit
            },
            {
                sortField,
                sortOrder: sortOrder as SortOrderType
            },
            {
                searchText
            },
            {
                userId: req.user.userId
            }
        );
    }
}

