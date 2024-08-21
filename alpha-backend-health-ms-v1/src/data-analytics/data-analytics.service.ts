import { Injectable } from '@nestjs/common';
import {
    GenericFilterDto,
    HealthProfileQuestionaries,
    healthProfileQuestionariesService,
    PaginationDto,
    SortingDto,
    surveyQuestionsService,
    UserHealthData,
    UserMealLog,
    userLessonService,
    userService,
    userHealthDataService,
    sessionService,
    DATA_TYPES,
    userMealLogService,
    User
} from '@launchpadapps-au/alpha-shared';

@Injectable()
export class DataAnalyticService {
    constructor(
    ) { }

    async getPatientDataOverview(
        userId?: string,
        fromDate?: Date,
        toDate?: Date,
    ): Promise<{
        steps: number,
        averageStepsPerDay: number,
        sleep: number,
        averageSleepPerDay: number,
        energy: number,
        averageEnergyPerDay: number,
        calories: number,
        averageCaloriesPerDay: number,
    }> {
        const { data: userHealthData } = await userHealthDataService.findAllUserHealthData(
            { page: null, limit: null },
            {},
            {
                userId,
                loggedAt: {
                    $gte: fromDate || new Date(new Date().setDate(new Date().getDate() - 1)),
                    $lte: toDate || new Date()
                }
            },
        );

        const steps = userHealthData.filter((data) => data.dataType === DATA_TYPES.STEP_COUNT).reduce((acc, curr) => acc + curr.value, 0);
        const averageStepsPerDay = steps / (toDate.getDate() - fromDate.getDate() + 1);

        const sleep = userHealthData.filter((data) => data.dataType === DATA_TYPES.SLEEP).reduce((acc, curr) => acc + curr.value, 0);
        const averageSleepPerDay = sleep / (toDate.getDate() - fromDate.getDate() + 1);

        const energy = userHealthData.filter((data) => data.dataType === DATA_TYPES.ENERGY).reduce((acc, curr) => acc + curr.value, 0);
        const averageEnergyPerDay = energy / (toDate.getDate() - fromDate.getDate() + 1);

        const { data: userMealLogs } = await userMealLogService.findAllUserMealLogs(
            { page: null, limit: null },
            {},
            { userId, loggedAt: { $gte: fromDate, $lte: toDate } },
        );


        const calories = userMealLogs.reduce((acc, curr) => acc + curr.calories, 0);
        const averageCaloriesPerDay = calories / (toDate.getDate() - fromDate.getDate() + 1);

        return { 
            steps,
            averageStepsPerDay,
            sleep,
            averageSleepPerDay,
            energy,
            averageEnergyPerDay,
            calories,
            averageCaloriesPerDay
        };
    }

    async getActivePatients(
        fromDate?: Date,
        toDate?: Date,
    ): Promise<number> {
        const users = await sessionService.findAllLoggedInSessionForUsers(fromDate, toDate, ['patient']);
        return users.length;
    }

    async getRecentEnrollements(
        fromDate?: Date,
        toDate?: Date,
    ): Promise<{
        users: {
            id: string,
            email: string,
            firstName: string,
            lastName: string,
            dob: Date,
        }[],
        count: number
    }> {
        const data = await userService.getRecentEnrollements(fromDate, toDate);

        return {
            count: data.count,
            users: data.users
                .map(({ id, email, firstName, lastName, dob }) => ({
                    id, email, firstName, lastName, dob
                })),
        }
    }

    async getLessonFeedbacks(
        userId?: string,
        categoryId?: string,
        themeId?: string,
    ) {
        const userLessonsFeedback = await userLessonService.getUserLessonFeebacks(userId, categoryId, themeId);

        return {
            userLessonsFeedback,
            totalFeedbacks: userLessonsFeedback.length,
            positivePercentage: userLessonsFeedback.filter((feedback) => feedback.isPositiveFeedback).length / userLessonsFeedback.length,
            negativePercentage: userLessonsFeedback.filter((feedback) => !feedback.isPositiveFeedback).length / userLessonsFeedback.length,
        };
    }
}
