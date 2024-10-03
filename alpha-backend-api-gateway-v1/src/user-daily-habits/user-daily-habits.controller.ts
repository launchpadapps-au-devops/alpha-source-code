import { Request, Body, Controller, Get, Post, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { UserDailyHabitsService } from './user-daily-habits.service';
import { UserHabitResponseDto } from './user-daily-habits.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserTypesGuard } from 'src/auth/userTypes';
import { PlatformGuard } from 'src/auth/platform.guard';
import { UserTypes } from 'src/auth/userTypes.decorator';
import { Platforms } from 'src/auth/platform.decorator';
import { USER_PLATFORMS, USER_TYPES } from '@launchpadapps-au/alpha-shared';

@ApiTags('User Daily Habits')
@ApiExtraModels(UserHabitResponseDto)
@Controller('user-daily-habits')
export class UserDailyHabitsController {
    constructor(private readonly userDailyHabitsService: UserDailyHabitsService) { }

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
                message: { type: 'string', example: 'User daily habits fetched successfully' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(UserHabitResponseDto) }
                },
                meta: { type: 'object' },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('options')
    async getUserDailyHabitOptions(@Request() req): Promise<object> {
        return await this.userDailyHabitsService.getUserDailyHabitOptions(req.user.userId, req.user);
    }

    @ApiExcludeEndpoint()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                habitIds: { type: 'array', items: { type: 'string' }, example: ['string'] }
            },
            required: ['habitIds'],
        }
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User daily habits selected successfully' },
                data: { type: 'object', example: {} },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Post('select')
    async selectUserDailyHabits(
        @Request() req,
        @Body() habitIds: string[]
    ): Promise<object> {
        return this.userDailyHabitsService.selectUserDailyHabits(req.user.userId, habitIds, req.user);
    }

    // get selected habits
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
                message: { type: 'string', example: 'User daily habits fetched successfully' },
                data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(UserHabitResponseDto) }
                },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Get('current')
    async getUserDailyHabit(@Request() req): Promise<object> {
        return await this.userDailyHabitsService.getUserDailyHabit(req.user.userId);
    }

    // start selected habit
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userHabitId: { type: 'string', example: 'string' }
            },
            required: ['userHabitId'],
        }
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User daily habit started successfully' },
                data: { type: 'object', example: {} },
                meta: { type: 'object', example: {} },
            },
            required: ['statusCode', 'data'],
        },
    })
    @Put('start')
    async startUserDailyHabit(
        @Request() req,
        @Body('userHabitId') userHabitId: string
    ): Promise<object> {
        return this.userDailyHabitsService.startUserDailyHabit(userHabitId, req.user);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, UserTypesGuard, PlatformGuard)
    @UserTypes(USER_TYPES.PATIENT)
    @Platforms(USER_PLATFORMS.PATIENT_MOBILE)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userHabitId: { type: 'string', example: 'string' }
            },
            required: ['userHabitId'],
        }
    })
    @ApiResponse({
        status: 200,
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                message: { type: 'string', example: 'User daily habit progress completed successfully' },
                data: {
                    type: 'object',
                    properties: {
                        userHabitProgress: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'progressId123' },
                                isCompleted: { type: 'boolean', example: true }
                            },
                            required: ['id', 'isCompleted']
                        },
                        userHabit: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: 'habitId456' },
                                isCompleted: { type: 'boolean', example: true },
                                totalPracticedDays: { type: 'number', example: 10 },
                                remainingDays: { type: 'number', example: 20 },
                                totalDays: { type: 'number', example: 30 }
                            },
                            required: ['id', 'isCompleted', 'totalPracticedDays', 'remainingDays', 'totalDays']
                        }
                    },
                    required: ['userHabitProgress', 'userHabit']
                },
                meta: { type: 'object', example: {} }
            },
            required: ['statusCode', 'data']
        },
    })
    @Put('complete/progress')
    async completeUserDailyHabit(
        @Request() req,
        @Body('userHabitProgressId') userHabitProgressId: string
    ): Promise<object> {
        return this.userDailyHabitsService.completeUserDailyHabitProgress(userHabitProgressId, req.user);
    }
}
