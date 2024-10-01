import { Request, Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { DataAnalyticService } from './data-analytics.service';
import { CreateHealthProfileQuestionariesDto, GetHealthProfileQuestionariesDto, CreateSurveyAnswerDto, GetSurveyAnswerDto, CreateUserHealthDataDto, GetUserHealthDataDto } from './data-analytics.dto';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { Platforms } from 'src/auth/platform.decorator';
import { USER_PLATFORMS, USER_TYPES, UserHealthData } from '@launchpadapps-au/alpha-shared';

@ApiTags('Data Analytics')
@ApiExtraModels(GetHealthProfileQuestionariesDto, GetSurveyAnswerDto, GetUserHealthDataDto)
@Controller('data-analytics')
export class DataAnalyticController {
    constructor(
        private readonly dataAnalyticService: DataAnalyticService,
        private readonly messageService: MessagingService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({ name: 'userId', required: false, description: 'Only allowed in case of Admin' })
    @ApiQuery({ name: 'fromDate', required: false })
    @ApiQuery({ name: 'toDate', required: false })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Data overview fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        steps: { type: 'number', example: 100 },
                        averageStepsPerDay: { type: 'number', example: 10 },
                        stepsPerDay: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    date: {
                                        type: 'string',
                                    },
                                    steps: {
                                        type: 'number'
                                    }
                                }
                            }
                        },
                        sleep: { type: 'number', example: 8 },
                        averageSleepPerDay: { type: 'number', example: 8 },
                        energy: { type: 'number', example: 100 },
                        averageEnergyPerDay: { type: 'number', example: 100 },
                        calories: { type: 'number', example: 1000 },
                        averageCaloriesPerDay: { type: 'number', example: 1000 },
                        nutritionData: {
                            type: 'object',
                            properties: {
                                calories: { type: 'number', example: 1000 },
                                protein: { type: 'number', example: 100 },
                                carbs: { type: 'number', example: 100 },
                                fats: { type: 'number', example: 100 },
                            }
                        },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/patient-data/overview/:userId?')
    async getPatientDataOverview(
        @Request() req,
        @Param('userId') userId?: string,
    ): Promise<object> {
        return this.dataAnalyticService.getPatientDataOverview(
            userId,
            req.query.fromDate,
            req.query.toDate,
            { userId: req.user.userId }
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'fromDate', required: false })
    @ApiQuery({ name: 'toDate', required: false })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Active patients fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        users: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', example: '123' },
                                    email: { type: 'string', example: 'abc@exmaple.com' },
                                    firstName: { type: 'string', example: 'John' },
                                    lastName: { type: 'string', example: 'Doe' },
                                    dob: { type: 'string', example: '1990-01-01' },
                                    gender: { type: 'string', example: 'male' },
                                    age: { type: 'number', example: 25 }
                                }
                            }
                        },
                        count: { type: 'number', example: 10 }
                    }
                },
                meta: { type: 'object', example: {} }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/active-patients')
    async getActivePatients(
        @Request() req,
    ): Promise<object> {
        return this.dataAnalyticService.getActivePatients(
            req.query.fromDate,
            req.query.toDate,
            { userId: req.user.userId }
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'fromDate', required: false })
    @ApiQuery({ name: 'toDate', required: false })
    @ApiQuery({ name: 'gender', required: false, enum: ['Male', 'Female', 'Non Binary'] })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Recent enrollements fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        users: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', example: '123' },
                                    email: { type: 'string', example: 'abc@exmaple.com' },
                                    firstName: { type: 'string', example: 'John' },
                                    lastName: { type: 'string', example: 'Doe' },
                                    dob: { type: 'string', example: '1990-01-01' },
                                    gender: { type: 'string', example: 'male' },
                                    age: { type: 'number', example: 25 }
                                }
                            }
                        },
                        count: { type: 'number', example: 10 }
                    }
                },
                meta: { type: 'object', example: {} }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/enrollements')
    async getEnrollements(
        @Request() req,
    ): Promise<object> {
        return this.dataAnalyticService.getEnrollements(
            req.query.fromDate,
            req.query.toDate,
            req.query.gender,
            { userId: req.user.userId }
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'userId', required: false })
    @ApiQuery({ name: 'categoryId', required: false })
    @ApiQuery({ name: 'themeId', required: false })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lesson feedbacks fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        userLessonFeedbacks: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', example: '123' },
                                    feedback: { type: 'string', example: 'Good' },
                                    feedbackDate: { type: 'string', example: '2021-01-01' },
                                    isPositiveFeedback: { type: 'boolean', example: true },
                                    userCategory: {
                                        type: 'object',
                                        properties: {
                                            category: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'number', example: 1 },
                                                    name: { type: 'string', example: 'Category 1' },
                                                }
                                            }
                                        }
                                    },
                                    userTheme: {
                                        type: 'object',
                                        properties: {
                                            theme: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'number', example: 1 },
                                                    name: { type: 'string', example: 'Theme 1' },
                                                }
                                            }
                                        }
                                    },
                                }
                            }
                        },
                        totalFeedbacks: { type: 'number', example: 10 },
                        positivePercentage: { type: 'number', example: 50 },
                        negativePercentage: { type: 'number', example: 50 },
                    }
                },
                meta: { type: 'object', example: {} }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/lesson-feedbacks')
    async getLessonFeedbacks(
        @Request() req,
    ): Promise<object> {
        return this.dataAnalyticService.getLessonFeedbacks(
            req.query.userId,
            req.query.categoryId,
            req.query.themeId,
            { userId: req.user.userId }
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'fromAge', required: true })
    @ApiQuery({ name: 'toAge', required: true })
    @ApiQuery({ name: 'fromDate', required: true })
    @ApiQuery({ name: 'toDate', required: true })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Average steps fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        totalStepsInDate: { type: 'number', example: 100 },
                        averageStepsInDate: { type: 'number', example: 100 },
                    }
                },
                meta: { type: 'object', example: {} }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/steps')
    async getAverageSteps(
        @Request() req,
    ): Promise<object> {
        return this.dataAnalyticService.getStepsAnalysis(
            req.query.fromAge,
            req.query.toAge,
            req.query.fromDate,
            req.query.toDate,
            { userId: req.user.userId }
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'planId', required: true })
    @ApiQuery({ name: 'fromDate', required: true })
    @ApiQuery({ name: 'toDate', required: true })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lifestyle plan analysis fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        count: { type: 'number', example: 10 },
                        users: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string', example: '123' },
                                    email: { type: 'string', example: 'abc@exmaple.com' },
                                    firstName: { type: 'string', example: 'John' },
                                    lastName: { type: 'string', example: 'Doe' },
                                    dob: { type: 'string', example: '1990-01-01' },
                                    gender: { type: 'string', example: 'male' },
                                    age: { type: 'number', example: 25 }
                                }
                            }
                        }
                    }
                }
            }
        }
    })
    @Get('/lifestyle-plan')
    async getLifestylePlanAnalysis(
        @Request() req,
    ): Promise<object> {
        return this.dataAnalyticService.lifestylePlanAnalysis(
            req.query.planId,
            req.query.fromDate,
            req.query.toDate,
            { userId: req.user.userId }
        );
    }
}