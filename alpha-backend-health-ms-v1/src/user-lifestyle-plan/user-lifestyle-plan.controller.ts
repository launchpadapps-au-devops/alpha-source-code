import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { UserLifeStylePlanService } from './user-lifestyle-plan.service'
import { HealthProfileQuestionaries, UserPlan } from '@launchpadapps-au/alpha-shared';

@Controller('user-lifetstyle-plan')
export class UserLifestylePlanController {
    constructor(
        private readonly userLifeStylePlanService: UserLifeStylePlanService
    ) { }

    @Post('/assign')
    async assignUserLifestylePlan(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: Partial<UserPlan>
    ) {
        await this.userLifeStylePlanService.assignUserLifestylePlan({
            ...payload
        }, {
            userId: reqUserId
        });

        return {
            message: 'User lifestyle plan assigned successfully'
        };
    }

    @Post('/personalize')
    async personalizeUserLifeStylePlan(
        @Headers('x-request-userId') reqUserId: string,
        @Body() payload: Partial<UserPlan>
    ) {
        await this.userLifeStylePlanService.personalizeUserLifeStylePlan(payload.userId, { userId: reqUserId });

        return {
            message: 'User lifestyle plan personalized successfully'
        };
    }

    @Get('/daily-lessons')
    async getUserLifestylePlan(
        @Headers('x-request-userId') reqUserId: string,
        @Query() query: any
    ) {
        const data = await this.userLifeStylePlanService.getUserDailyLesson(reqUserId);

        return {
            message: 'User lifestyle plan fetched successfully',
            data: data
        };
    }

}
