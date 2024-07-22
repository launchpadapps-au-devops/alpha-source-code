import { Body, Controller, Get, Headers, Param, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { DailyTipsService } from './dailyTips.service';
import { DailyTips, POLICY_TYPES, Policy, USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { Platforms } from 'src/auth/platform.decorator';

@ApiTags('Daily Tips')
@Controller('daily-tip')
export class DailyTipController {
    constructor(
        private readonly dailyTipsService: DailyTipsService,
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiBody({
        description: 'The payload for adding daily tips',
        schema: {
            type: 'object',
            properties: {
                dailyTipData: {
                    type: 'object',
                    properties: {
                        content: { type: 'string', example: 'This is a daily tip' },
                        day: { type: 'number', example: 1 },
                    },
                    required: ['content', 'day'],
                },
                position: { type: 'string', enum: ['above', 'below'], example: 'above', },
                referenceTipId: { type: 'number', example: 1, },
            },
            required: ['dailyTipData'],
        },
    })
    @ApiResponse({
        status: 201,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Daily tip for day 1 has been added successfully' },
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
    @Post()
    async addDailyTip(
        @Request() req,
        @Body() payload: {
            dailyTipData: Partial<DailyTips>,
            position?: 'above' | 'below',
            referenceTipId?: number
        }
    ) {
        return this.dailyTipsService.addDailyTips(
            payload.dailyTipData,
            payload.position,
            payload.referenceTipId,
            req.user
        );
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'day',
        description: 'The day to fetch the daily tip',
        required: true,
        type: 'number',
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Daily tip for day 1 fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: '1' },
                        day: { type: 'number', example: '1' },
                        content: { type: 'string', example: 'This is a daily tip' },
                        status: { type: 'string', enum: ['ACTIVE', 'ARCHIVE'], example: 'ACTIVE' },
                        version: { type: 'number', example: '1' },
                        createdAt: { type: 'string', format: 'date-time', example: '2021-09-01T00:00:00.000Z' },
                        createdBy: { type: 'string', example: '1' },
                        updatedAt: { type: 'string', format: 'date-time', example: '2021-09-01T00:00:00.000Z' },
                        updatedBy: { type: 'string', example: '1' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/:day')
    async getDailyTip(
        @Param('day') day: number
    ) {
        return this.dailyTipsService.findDailyTipsByDay(day);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiQuery({
        name: 'status',
        description: 'The status to update the daily tip to',
        type: 'string',
        enum: ['ACTIVE', 'ARCHIVE'],
        required: false,
    })
    @ApiQuery({
        name: 'page',
        description: 'The page number',
        required: false,
        type: 'number',
    })
    @ApiQuery({
        name: 'limit',
        description: 'The number of records per page',
        required: false,
        type: 'number',
    })
    @ApiQuery({
        name: 'sortField',
        description: 'The field to sort by',
        required: false,
        type: 'string',
    })
    @ApiQuery({
        name: 'sortOrder',
        description: 'The order to sort by',
        required: false,
        type: 'string',
        enum: ['ASC', 'DESC'],
    })
    @ApiQuery({
        name: 'searchText',
        description: 'The text to search for',
        required: false,
        type: 'string',
    })
    @ApiQuery({
        name: 'day',
        description: 'The day to filter by',
        required: false,
        type: 'number',
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Daily tips fetched successfully' },
                data: {
                    type: 'object',
                    properties: {
                        total: { type: 'number', example: 1 },
                        page: { type: 'number', example: 1 },
                        limit: { type: 'number', example: 10 },
                        items: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number', example: '1' },
                                    day: { type: 'number', example: '1' },
                                    content: { type: 'string', example: 'This is a daily tip' },
                                    status: { type: 'string', enum: ['ACTIVE', 'ARCHIVE'], example: 'ACTIVE' },
                                    version: { type: 'number', example: '1' },
                                    createdAt: { type: 'string', format: 'date-time', example: '2021-09-01T00:00:00.000Z' },
                                    createdBy: { type: 'string', example: '1' },
                                    updatedAt: { type: 'string', format: 'date-time', example: '2021-09-01T00:00:00.000Z' },
                                    updatedBy: { type: 'string', example: '1' },
                                },
                                required: ['id', 'day', 'content', 'status', 'version', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'],
                            },
                        },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get()
    async getAllDailyTips(
        @Query('status') status : string,
        @Query('searchText') searchText: string,
        @Query('day') day: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortField') sortField: string = 'day',
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',

    ) {
        const data = await this.dailyTipsService.findAllDailyTips({
            page,
            limit
        }, {
            sortField,
            sortOrder
        }, {
            searchText,
            day,
            status
        });

        return {
            message: 'Daily tips fetched successfully',
            data
        };
    }
}