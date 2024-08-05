import { Body, Controller, Get, Headers, Param, Post, Put, Request } from '@nestjs/common';
import { UserMealLog, SortOrderType } from '@launchpadapps-au/alpha-shared';
import { UserMealService } from './user-meal.service';

@Controller('user-meal')
export class UserMealController {
    constructor(private readonly userMealService: UserMealService) { }

    @Post()
    async createUserMealLog(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<UserMealLog>
    ) {
        const userMealLog = await this.userMealService.createUserMealLog(data, { userId: reqUserId });
        return {
            message: `User meal log created successfully`,
            data: {
                id: userMealLog.id,
            },
        }
    }

    @Put('/:userMealId')
    async updateUserMealLog(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: Partial<UserMealLog>,
        @Param('userMealId') userMealId: string
    ) {
        const userMealLog = await this.userMealService.updateUserMealLog(userMealId, data, { userId: reqUserId });
        return {
            message: `User meal log updated successfully`,
            data: {
                id: userMealLog.id,
            },
        }
    }

    @Get('/:userMealId')
    async findUserMealLogById(
        @Headers('x-request-userId') reqUserId: string,
        @Param('userMealId') userMealId: string
    ) {
        const userMealLog = await this.userMealService.findUserMealLogById(userMealId);
        return {
            message: `User meal log fetched successfully`,
            data: userMealLog,
        }
    }

    @Get()
    async findAllUserMealLogs(
        @Headers('x-request-userId') reqUserId: string,
        @Request() req
    ) {
        const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'DESC', ...filters } = req.query;
        const repsonse = await this.userMealService.findAllUserMealLogs(
            {
                page: Number(page),
                limit: Number(limit),
            },
            {
                sortField,
                sortOrder: sortOrder as SortOrderType
            },
            { 
                ...filters,
            }
        );
        return {
            message: `User meal logs fetched successfully`,
            data: repsonse.data,
            meta: {
                page: repsonse.page,
                limit: repsonse.limit,
                totalRecords: repsonse.totalRecords,
                totalPages: Math.ceil(repsonse.totalRecords / repsonse.limit)
            }
        }
    }
}
