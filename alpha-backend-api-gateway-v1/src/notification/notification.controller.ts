import { Body, Controller, ForbiddenException, Get, Headers, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { NotificationResponseDto, CreateNotificationPreferenceDto, NotificationPreferenceResponseDto, UpdateNotificationPreferenceDto, UpdateNotificationDto } from './notification.dto';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { NotificationPreference, USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';
import { Platforms } from 'src/auth/platform.decorator';

@ApiTags('Notification')
@ApiExtraModels(NotificationResponseDto, CreateNotificationPreferenceDto, NotificationPreferenceResponseDto, UpdateNotificationPreferenceDto)
@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiQuery({ 
        name: 'userId', 
        type: 'string', 
        required: false, 
        example: 'userId',
        description: "Only allowed for admin and staff"
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
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Lesson added successfully' },
                data: { 
                    type: 'array',
                    items: { $ref: getSchemaPath(NotificationResponseDto) }
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
    @Get('/')
    async getNotifications(
        @Request() req,
    ) {
        let { userId, page, limit, sortField, sortOrder } = req.query;

        if(req.user.userType === USER_TYPES.PATIENT) {
            if(userId !== req.user.id) {
                throw new ForbiddenException('You are not allowed for this operation');
            }

            userId = req.user.id;
        }

        return this.notificationService.getNotifications(
            { page, limit },
            { sortField, sortOrder },
            { 
                userId,
                isSeen: true,
                proccessed: true,
                status: 'sent'
            }
        );
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'notificationId',
        description: 'Notification ID',
        type: 'number',
        required: true
    })
    @ApiBody({ type: UpdateNotificationDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Notification updated sucessfully' },
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
    @Put('/:notificationId')
    async updateNotification(
        @Request() req,
        @Param('notificationId') notificationId: number,
        @Body() payload: UpdateNotificationDto
    ) {
        return this.notificationService.updateNotification(notificationId, payload, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({
        schema: {
            type: 'array',
            items: {
                type: 'uuid',
                example: 1,
                description: 'Notification ID'
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
                message: { type: 'string', example: 'Notification updated sucessfully' },
                data: {
                    type: 'array',
                    items: {
                        type: 'uuid',
                        example: 1,
                        description: 'Notification ID'
                    }
                }                    
            },
            required: ['statusCode'],
        },
    })
    @Put('/mark-as-seen')
    async bulkUpdateNotification(
        @Request() req,
        @Body() payload: [number]
    ) {
        const data = payload.map(id => ({ id, isSeen: true }));
        return this.notificationService.bulkUpdateNotification(data, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'userId',
        description: 'User ID',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Notification Preference fetched sucessfully' },
                data: { 
                    type: 'array',
                    items: { $ref: getSchemaPath(NotificationPreferenceResponseDto) }
                },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('/preference/:userId')
    async getUserNotificationPreference(
        @Request() req,
        @Param('userId') userId: string
    ) {
        return this.notificationService.getUserNotificationPreference(userId);
    }


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard , UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.STAFF)
    @Platforms(USER_PLATFORMS.ADMIN_WEB)
    @ApiParam({
        name: 'id',
        description: 'Preference ID',
        type: 'uuid',
        required: true
    })
    @ApiBody({ type: UpdateNotificationPreferenceDto })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'Notification Preference updated sucessfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: 'uuid' },
                    },
                }
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('/preference/:id')
    async updateNotificationPreference(
        @Request() req,
        @Param('id') id: string,
        @Body() payload: Partial<NotificationPreference>
    ) {
        return this.notificationService.updateUserNotificationPreference(id, payload, req.user);
    }
}
