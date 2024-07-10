import { Injectable } from '@nestjs/common';
import { DailyTips, dailyTipsService, PaginationDto, SortingDto, GenericFilterDto } from '@launchpadapps-au/alpha-shared';


@Injectable()
export class DailyTipsService {
    constructor(
    ) { }

    async addDailyTips(
        data: Partial<DailyTips>, 
        position?: 'above' | 'below',
        referenceTipId?: number,
        reqUser = { userId: null }
    ): Promise<DailyTips> {
        return dailyTipsService.addDailyTips(
            {
                ...data,
                updatedBy: reqUser.userId
            },
            position,
            referenceTipId
        );
    }

    async findDailyTipsByDay(day: number): Promise<DailyTips> {
        return dailyTipsService.findDailyTipsByDay(day);
    }

    async findAllDailyTips(
        pagination: PaginationDto = { page: 1, limit: 10 },
        sortOptions: SortingDto = { sortField: 'day', sortOrder: 'ASC' },
        filters: GenericFilterDto = {},
    ): Promise<{
        data: DailyTips[],
        totalRecords: number
        limit?: number,
        page?: number
    }> {
        return dailyTipsService.findAllDailyTips(pagination, sortOptions, filters);
    }
}
