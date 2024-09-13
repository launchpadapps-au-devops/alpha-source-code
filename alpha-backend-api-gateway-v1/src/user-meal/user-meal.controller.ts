import { Body, Controller, ForbiddenException, Get, Headers, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { Theme, USER_PLATFORMS, USER_TYPES, UserMealLog } from '@launchpadapps-au/alpha-shared';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { CreateUserMealLogDTO, UpdateUserMealLogDTO, GetUserMealLogDTO } from './user-meal.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { Platforms } from 'src/auth/platform.decorator';
import { UserMealService } from './user-meal.service';

@ApiTags('User Meal')
@ApiExtraModels(CreateUserMealLogDTO, UpdateUserMealLogDTO, GetUserMealLogDTO)
@Controller('user-meal')
export class UserMealController {
    constructor(private readonly userMealService: UserMealService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({
        type: CreateUserMealLogDTO
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User meal log created successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                    },
                },
            },
            required: ['message', 'data'],
        },
    })
    @Post('log')
    async createUserMealLog(
        @Req() req,
        @Body() data: Partial<UserMealLog>
    ) {
        const userMealLog = await this.userMealService.createUserMealLog(data, { userId: req.user.userId });
        return {
            message: `User meal log created successfully`,
            data: {
                id: userMealLog.id,
            },
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({
        type: UpdateUserMealLogDTO
    })
    @ApiParam({
        name: 'userMealLogId',
        description: 'User meal log ID',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User meal log updated successfully' },
                data: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                    },
                },
            },
            required: ['message', 'data'],
        },
    })
    @Put('log/:userMealLogId')
    async updateUserMealLog(
        @Req() req,
        @Body() data: Partial<UserMealLog>,
        @Param('userMealLogId') userMealLogId: string
    ) {
        const userMealLog = await this.userMealService.updateUserMealLog(userMealLogId, data, { userId: req.user.userId });
        return {
            message: `User meal log updated successfully`,
            data: {
                id: userMealLog.id,
            },
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiParam({
        name: 'userMealLogId',
        description: 'User meal log ID',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User meal log fetched successfully' },
                data: { type: 'object', $ref: getSchemaPath(GetUserMealLogDTO) },
            },
            required: ['message', 'data'],
        },
    })
    @Get('log/:userMealId')
    async findUserMealLogById(
        @Param('userMealId') userMealLogId: string
    ) {
        const userMealLog = await this.userMealService.findUserMealLogById(userMealLogId);
        return {
            message: `User meal log fetched successfully`,
            data: userMealLog,
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.ADMIN, USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.ADMIN_WEB, USER_PLATFORMS.PATIENT_MOBILE)
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
        name: 'userId',
        description: 'Only for admin',
        type: 'string',
        required: false,
        example: 'user123',
    })
    @ApiQuery({
        name: 'mealType',
        type: 'string',
        required: false,
        example: 'breakfast',
    })
    @ApiQuery({
        name: 'entryType',
        type: 'string',
        required: false,
        example: 'manual',
    })
    @ApiQuery({
        name: 'mealName',
        type: 'string',
        required: false,
        example: 'Omelette',
    })
    @ApiResponse({
        status: 200,
        description: 'A successful response',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'User meal logs fetched successfully' },
                data: { type: 'array', items: { $ref: getSchemaPath(GetUserMealLogDTO) } },
            },
            required: ['message', 'data'],
        },
    })
    @Get('log')
    async findAllUserMealLogs(
        @Request() req
    ) {
        if(req.user.userType === USER_TYPES.PATIENT) {
            if(req.query.userId && (req.query.userId !== req.user.userId)) {
                throw new ForbiddenException('You are not allowed to access this resource');
            }

            req.query.userId = req.user.userId;
        }

        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;
        return this.userMealService.findAllUserMealLogs(
            {
                page: Number(page),
                limit: Number(limit),
            },
            {
                sortField,
                sortOrder,
            },
            filters,
        );
    }
}
