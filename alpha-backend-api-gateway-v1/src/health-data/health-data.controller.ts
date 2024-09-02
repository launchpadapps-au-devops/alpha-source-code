import { Request, Body, Controller, Get, Post, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { HealthDataService } from './health-data.service';
import { CreateHealthProfileQuestionariesDto, GetHealthProfileQuestionariesDto, CreateSurveyAnswerDto, GetSurveyAnswerDto, CreateUserHealthDataDto, GetUserHealthDataDto } from './health-data.dto';
import { MessagingService } from '../common/messaging.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { Platforms } from 'src/auth/platform.decorator';
import { USER_PLATFORMS, USER_TYPES, UserHealthData } from '@launchpadapps-au/alpha-shared';

@ApiTags('Health Data')
@ApiExtraModels(GetHealthProfileQuestionariesDto, GetSurveyAnswerDto, GetUserHealthDataDto)
@Controller('health-data')
export class HealthDataController {
    constructor(
        private readonly healthDataService: HealthDataService,
        private readonly messageService: MessagingService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Health profile questionaries added successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/questionaries')
    async createPatientUserProfile(
        @Request() req,
        @Body() payload: CreateHealthProfileQuestionariesDto
    ): Promise<object> {
        return await this.healthDataService.addHealthProfileQuestionaries(payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ 
        name: 'userId', 
        required: false, 
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Health profile questionaries fetched successfully' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(GetHealthProfileQuestionariesDto) }
                },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('/questionaries')
    async getHealthProfileQuestionaries(
        @Request() req,
        @Query('userId') userId?: number
    ): Promise<object> {
        return await this.healthDataService.getHealthProfileQuestionaries(userId, req.user);
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({ type: CreateSurveyAnswerDto })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Survey question answer added successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '5f8f4f4f4f4f4f4f4f4f4f4f' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('/survey-questions')
    async addSurveyQuestionAnswer(
        @Request() req,
        @Body() payload: CreateSurveyAnswerDto
    ): Promise<object> {
        return await this.healthDataService.addSurveyQuestionAnswer(payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB,USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'surveyType', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'sortField', required: false })
    @ApiQuery({ name: 'sortOrder', required: false })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Survey question answer fetched successfully' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(GetSurveyAnswerDto) }
                },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/survey-questions')
    async getActiveSurveyQuestionAnswer(
        @Request() req
    ): Promise<object> {
        const { limit, page, sortField, sortOrder, surveyType } = req.query;
        return await this.healthDataService.getActiveSurveyQuestionAnswer(
            { limit, page },
            { sortField, sortOrder },
            { surveyType },
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({ 
        type: [ CreateUserHealthDataDto ] 
    })
    @Post('/bulk')
    async addBulkHealthData(
        @Request() req,
        @Body() payload: Partial<UserHealthData[]>
    ): Promise<object> {
        return await this.healthDataService.addBulkHealthData(payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'sortField', required: false })
    @ApiQuery({ name: 'sortOrder', required: false })
    @ApiQuery({ name: 'source', required: false })
    @ApiQuery({ name: 'dataType', required: false })
    @ApiQuery({ name: 'loggedAt', required: false })
    @ApiQuery({ name: 'userId', required: false, description: 'Only allowed in case of Admin' })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User health data fetched successfully' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(GetUserHealthDataDto) }
                },
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
    @Get()
    async getUserHealthData(
        @Request() req
    ): Promise<object> {
        const { limit, page, sortField, sortOrder, source, dataType, loggedAt } = req.query;
        let userId = req.query.userId;
        if(req.user.type === USER_TYPES.PATIENT) {
            userId = req.user.userId;
        }
            
        return await this.healthDataService.getUserHealthData(
            { limit, page },
            { sortField, sortOrder },
            { source, dataType, loggedAt, userId },
            req.user
        );
    }
}