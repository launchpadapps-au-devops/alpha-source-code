import { Injectable } from '@nestjs/common';
import { Category, GenericFilterDto, PaginationDto, SortingDto, SortOrderType, categoryService, userMealLogService } from '@launchpadapps-au/alpha-shared';
import { UserMealLog } from '@launchpadapps-au/alpha-shared/dist/database/entities/userMeal.entity';
@Injectable()
export class CategoryService {
    constructor() { }

    async createCategory(data: Partial<Category>, reqUser = { userId: null }): Promise<Category> {
        return categoryService.createCategory({
            ...data,
            createdBy: reqUser.userId,
            updatedBy: reqUser.userId
        });
    }

    async updateCategory(id: number, data: Partial<Category>, reqUser = { userId: null }): Promise<Category> {
        return categoryService.updateCategory(id, {
            ...data,
            updatedBy: reqUser.userId
        });
    }

    async bulkUpdateCategory(data: Partial<Category>[], reqUser = { userId: null }): Promise<Category[]> {
        return categoryService.bulkUpdateCategory(
            data.map(c => ({
                ...c,
                ...(!c.id ? { createdBy: reqUser.userId } : {}),
                updatedBy: reqUser.userId
            }))
        );
    }

    async findCategoryById(id: number): Promise<Category> {
        return categoryService.findCategoryById(id);
    }

    async findAllCategories(
        pagination = { page: 1, limit: 10 }, 
        sorting = { sortField: 'createdAt', sortOrder: 'DESC' as SortOrderType },
        filter: GenericFilterDto = {}
    ) : Promise<{
        data: Category[];
        totalRecords: number;
        limit: number;
        page: number;
    }> {
        return categoryService.findAllCategories(pagination, sorting, filter);
    }
}


@Injectable()
export class UserMealService {
    constructor() { }

    async createUserMealLog(data: Partial<UserMealLog>, reqUser = { userId: null }): Promise<UserMealLog> {
        return userMealLogService.createUserMealLog({
            ...data,
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
