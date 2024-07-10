import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { DailyTips } from '@launchpadapps-au/alpha-shared';
import { DailyTipsService } from './dailyTip.service';

@Controller('daily-tip')
export class DailyTipController {
    constructor(
        private readonly dailyTipsService: DailyTipsService,
    ) { }

    @Post()
    async addDailyTip(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: {
            dailyTipData: Partial<DailyTips>,
            position?: 'above' | 'below',
            referenceTipId?: number
        }
    ) {
        const data = await this.dailyTipsService.addDailyTips(
            payload.dailyTipData, 
            payload.position, 
            payload.referenceTipId, 
            { userId: reqUserId }
        );

        return {
            message: `Daily tip for day ${payload.dailyTipData.day} has been added successfully`,
            data: {
                id: data.id
            },
        };
    }

    @Get('/:day')
    async getDailyTip(
        @Headers('x-request-userId') reqUserId: string,
        @Param('day') day: number
    ) {
        const data = await this.dailyTipsService.findDailyTipsByDay(day);
        return {
            message: `Daily tip for day ${day} fetched successfully`,
            data
        };
    }

    @Get()
    async getAllDailyTips(
        @Headers('x-request-userId') reqUserId: string,
        @Query('status') status: 'ACTIVE' | 'ARCHIVE',
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: 'ASC' | 'DESC',
        @Query('searchText') searchText: string,
        @Query('day') day: number,
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
            data: data.data,
            meta: {
                totalRecords: data.totalRecords,
                limit: data.limit,
                page: data.page,
                totalPages: Math.ceil(data.totalRecords / data.limit)
            }
        };
    }
}