
import { Request, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UserLifeStylePlanService } from './user-lifestyle-plan.service';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { Platforms } from 'src/auth/platform.decorator';


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
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User daily lesson fetched successfully' },
                data: { 
                    type: 'array',
                    items: { 
                        type: 'object', 
                        properties: {
                            id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                            userId: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                            userPlanId: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                            userThemeId: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f' },
                            lessonId: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                            isCompleted: { type: 'boolean', example: false },
                            lesson: { 
                                type: 'object', 
                                properties: { 
                                    name: { type: 'string', example: 'Lesson 1' },
                                    description: { type: 'string', example: 'This is lesson 1' },
                                    lessonCode: { type: 'string', example: 'lesson_1' },
                                    lessonTags: { type: 'array', items: { type: 'string', example: 'tag1' } },
                                },
                            },
                            pointsEarned: { type: 'number', example: 0 },
                            quizRetry: { type: 'number', example: 0 },
                            updatedAt: { type: 'string', example: '2021-01-01T00:00:00.000Z' },
                            createdAt: { type: 'string', example: '2021-01-01T00:00:00.000Z' },
                            createdBy: { type: 'string', example: {} },
                            updatedBy: { type: 'string', example: {} },
                        },
                    }
                },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'message'],
        },
    })
    @Get('/daily-lessons')
    async getUserDailyLesson(
        @Request() req
    ) {
        return await this.userLifeStylePlanService.getUserDailyLesson({
            userId: req.user.userId
        });
    }
}

