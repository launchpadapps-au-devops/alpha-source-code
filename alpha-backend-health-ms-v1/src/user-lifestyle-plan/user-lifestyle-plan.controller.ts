import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { UserLifeStylePlanService } from './user-lifestyle-plan.service'
import { SortOrderType, UserPlan } from '@launchpadapps-au/alpha-shared';

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

    @Get('/progress') 
    async getUserPlanProgress(
        @Headers('x-request-userId') reqUserId: string
    ) {
        const data = await this.userLifeStylePlanService.getUserPlanProgress(reqUserId);

        return {
            message: 'User progress fetched successfully',
            data: data
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

    @Put('/daily-lessons/complete/:userLessonId')
    async completeUserLesson(
        @Headers('x-request-userId') reqUserId: string,
        @Param('userLessonId') userLessonId: string
    ) {
        const data = await this.userLifeStylePlanService.completeUserDailyLesson(userLessonId, { userId: reqUserId });

        return {
            message: 'User lesson completed successfully',
            data
        };
    }

    @Put('/daily-lessons/feedback/:userLessonId')
    async feedbackUserLesson(
        @Headers('x-request-userId') reqUserId: string,
        @Param('userLessonId') userLessonId: string,
        @Body() payload: {
            feedback: string,
            isPositiveFeedback: boolean,
        }
    ) {
        await this.userLifeStylePlanService.addUserLessonFeedback(userLessonId, payload.feedback, payload.isPositiveFeedback, { userId: reqUserId });

        return {
            message: 'User lesson feedback submitted successfully',
            data: {
                userLessonId
            }
        };
    }

    @Get('/daily-lessons/feedback/:userLessonId')
    async getUserLessonFeedback(
        @Headers('x-request-userId') reqUserId: string,
        @Param('userLessonId') userLessonId: string
    ) {
        const data = await this.userLifeStylePlanService.getUserLessonFeedback(userLessonId);

        return {
            message: 'User lesson feedback fetched successfully',
            data: data
        };
    }

    @Put('/daily-lessons/bookmark/:userLessonId')
    async bookmarkUserLesson(
        @Headers('x-request-userId') reqUserId: string,
        @Param('userLessonId') userLessonId: string
    ) {
        await this.userLifeStylePlanService.toggleBookmarkUserLesson(userLessonId, { userId: reqUserId });

        return {
            message: 'User lesson bookmarked successfully',
            data: {
                userLessonId
            }
        };
    }

    @Get('/daily-lessons/bookmarked')
    async getBookmarkedUserLesson(
        @Headers('x-request-userId') reqUserId: string,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sortField') sortField: string,
        @Query('sortOrder') sortOrder: SortOrderType,
        @Query('searchText') searchText: string
    ) {
        const data = await this.userLifeStylePlanService.getUserBookmarkedLessons(
            reqUserId,
            {
                page,
                limit
            },
            {
                searchText
            },
            {
                sortField,
                sortOrder
            },
        );

        return {
            message: 'User bookmarked lessons fetched successfully',
            data: data.data,
            meta: {
                page: data.page,
                limit: data.limit,
                totalRecords: data.totalRecords,
                totalPages: Math.ceil(data.totalRecords / data.limit)
            }
        };
    }
}
