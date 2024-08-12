import { Injectable } from '@nestjs/common';
import { GenericFilterDto, PaginationDto, SortingDto, SortOrderType, categoryService, userMealLogService } from '@launchpadapps-au/alpha-shared';
import { UserMealLog } from '@launchpadapps-au/alpha-shared/dist/database/entities/userMeal.entity';

@Injectable()
export class UserMealService {
    constructor() { }

    async createUserMealLog(data: Partial<UserMealLog>, reqUser = { userId: null }): Promise<UserMealLog> {
        return userMealLogService.createUserMealLog({
            ...data,
            userId: reqUser.userId,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });
    }

    async updateUserMealLog(id: string, data: Partial<UserMealLog>, reqUser = { userId: null }): Promise<UserMealLog> {
        return userMealLogService.updateUserMealLog(id, {
            ...data,
            updatedBy: reqUser.userId
        });
    }

    async findUserMealLogById(id: string): Promise<UserMealLog> {
        return userMealLogService.findUserMealLogById(id);
    }

    async findAllUserMealLogs(
        pagination = { page: 1, limit: 10 }, 
        sorting = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
        filter: GenericFilterDto = {}
    ) : Promise<{
        data: UserMealLog[];
        totalRecords: number;
        limit: number;
        page: number;
    }> {
        return userMealLogService.findAllUserMealLogs(pagination, sorting, filter);
    }
}
