import { Body, Controller, Get, Param, Post, Put, Query, Headers, Req } from '@nestjs/common';
import { DataAnalyticService } from './data-analytics.service';
import { UserHealthData, UserMealLog } from '@launchpadapps-au/alpha-shared';

@Controller('data-analytics')
export class DataAnalyticController {
    constructor(
        private readonly dataAnalyticService: DataAnalyticService
    ) { }

    @Get('patient-data/overview/:userId?')
    async getPatientDataOverview(
        @Param('userId') userId: string,
        @Query('fromDate') fromDate: Date,
        @Query('toDate') toDate: Date
    ) {
        const data = await this.dataAnalyticService.getPatientDataOverview(userId, fromDate, toDate);
        return {
            data,
            message: 'Data overview fetched successfully',
        }
    }

    @Get('active-patients')
    async getActivePatients(
        @Query('fromDate') fromDate: Date,
        @Query('toDate') toDate: Date
    ): Promise<{
        message: string,
        data: {
            users: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
                dob: Date;
                gender: string;
                age: number;
                onboardingCompletedAt: Date;
            }[];
            count: number;
        }
    }> {
        const data = await this.dataAnalyticService.getActivePatients(fromDate, toDate);
        return {
            data,
            message: 'Active patients fetched successfully',
        }
    }

    @Get('enrollements')
    async getRecentEnrollements(
        @Query('fromDate') fromDate: Date,
        @Query('toDate') toDate: Date
    ) {
        const data = await this.dataAnalyticService.getRecentEnrollements(fromDate, toDate);
        return {
            data,
            message: 'Recent enrollements fetched successfully',
        }
    }

    @Get('lesson-feedbacks')
    async getLessonFeedbacks(
        @Query('userId') userId: string,
        @Query('categoryId') categoryId: string,
        @Query('themeId') themeId: string
    ): Promise<{
        message: string,
        data: {
            userLessonFeedbacks: {
                id: string,
                feedback: string,
                feedbackDate: Date,
                isPoisitiveFeedback: boolean,
                userCategory: { category: { id: number, name: string } },
                userTheme: { theme: { id: number, name: string } },
            }[],
            totalFeedbacks: number,
            positivePercentage: number,
            negativePercentage: number,
        },
    }> {
        const data = await this.dataAnalyticService.getLessonFeedbacks(userId, categoryId, themeId);
        return {
            data: {
                userLessonFeedbacks: data.userLessonsFeedback.map((feedback) => ({
                    id: feedback.id,
                    feedback: feedback.feedback,
                    feedbackDate: feedback.feedbackDate,
                    isPoisitiveFeedback: feedback.isPositiveFeedback,
                    userCategory: { category: { id: feedback.userCategory.category.id, name: feedback.userCategory.category.name } },
                    userTheme: { theme: { id: feedback.userTheme.theme.id, name: feedback.userTheme.theme.name } },
                })),
                totalFeedbacks: data.totalFeedbacks,
                positivePercentage: data.positivePercentage,
                negativePercentage: data.negativePercentage,
            },
            message: 'Lesson feedbacks fetched successfully',
        }
    }
}
