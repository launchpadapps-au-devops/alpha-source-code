import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { Plan, SortOrderType } from '@launchpadapps-au/alpha-shared';
import { PlanService } from './plan.service';

@Controller('plan')
export class PlanController {
    constructor(
        private readonly planService: PlanService
    ) { }

    @Post()
    async createPlan(
        @Headers('x-request-userId') reqUserId: string,
        @Body() data: {
            planData: Partial<Plan>
            themes: number[]
        }
    ) {
        const plan = await this.planService.createPlan(data.planData);
        await this.planService.updatePlanThemes(plan.id, data.themes);

        return {
            message: 'Plan created successfully',
            data: {
                id: plan.id
            },
            meta: {}
        };
    }

    @Put('/:planId')
    async updatePlan(
        @Headers('x-request-userId') reqUserId: string,
        @Param('planId') planId: number,
        @Body() data: {
            planData: Partial<Plan>
            themes: number[]
        }
    ) {
        const plan = await this.planService.updatePlan(planId, data.planData);
        await this.planService.updatePlanThemes(plan.id, data.themes);

        return {
            message: 'Plan updated successfully',
            data: {
                id: plan.id
            },
            meta: {}
        };
    }

    @Get('/')
    async getPlans(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortField') sortField: string = 'updatedAt',
        @Query('sortOrder') sortOrder: SortOrderType = 'DESC',
        @Query('searchText') searchText: string = '',
    ) {
        const response = await this.planService.findAllPlans(
            { page, limit },
            { sortField, sortOrder },
            { searchText }
        );

        return {
            message: 'Plans fetched successfully',
            data: response.data,
            meta: {
                page: response.page,
                limit: response.limit,
                totalRecords: response.totalRecords,
                totalPages: Math.ceil(response.totalRecords / response.limit)
            }
        };
    }

    @Get('/:planId')
    async getPlanById(
        @Param('planId') planId: number
    ) {
        const plan = await this.planService.findPlanById(planId);
        return {
            message: 'Plan fetched successfully',
            data: plan,
            meta: {}
        };
    }
}
