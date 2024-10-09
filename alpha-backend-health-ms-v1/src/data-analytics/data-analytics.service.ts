import { Injectable } from '@nestjs/common';
import {
    userLessonService,
    userService,
    userHealthDataService,
    sessionService,
    DATA_TYPES,
    userMealLogService,
    userPlanService,
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
        stepsPerDay: { date: string; steps: number }[],
        sleep: number,
        averageSleepPerDay: number,
        energy: number,
        averageEnergyPerDay: number,
        calories: number,
        averageCaloriesPerDay: number,
        nutritionData: any
    }> {
        // Your logic remains unchanged
        const startDate = fromDate ? new Date(fromDate) : new Date(new Date().setDate(1)); // Default to the start of the current month
        const endDate = toDate ? new Date(toDate) : new Date(); // Default to today
    
        // Ensure that startDate and endDate are valid Date objects
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Invalid date provided.");
        }
    
        // Calculate the number of days between the two dates
        const daysDifference = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
        // Fetch user health data
        const { data: userHealthData = [] } = await userHealthDataService.findAllUserHealthData(
            { page: null, limit: null },
            {},
            {
                userId,
                fromDate: startDate,
                toDate: endDate
            },
        );
    
        // Calculate steps and steps per day
        const steps = userHealthData
            .filter((data) => data.dataType === DATA_TYPES.STEP_COUNT)
            .reduce((acc, curr) => acc + curr.value, 0);
    
        const stepsPerDay = userHealthData
            .filter(({ dataType }) => dataType === DATA_TYPES.STEP_COUNT)
            .reduce((acc, { createdAt, value }) => {
                const dateString = new Date(createdAt).toISOString().split('T')[0];
                const existingEntry = acc.find((entry) => entry.date === dateString);
    
                if (existingEntry) {
                    existingEntry.steps += value;
                } else {
                    acc.push({ date: dateString, steps: value });
                }
    
                return acc;
            }, [] as { date: string; steps: number }[]);
    
        const averageStepsPerDay = daysDifference > 0 ? steps / daysDifference : 0;
    
        // Calculate energy and average energy per day
        const energy = userHealthData
            .filter((data) => data.dataType === DATA_TYPES.ENERGY)
            .reduce((acc, curr) => acc + curr.value, 0);
    
        const averageEnergyPerDay = daysDifference > 0 ? energy / daysDifference : 0;
    
        const { data: userMealLogs = [] } = await userMealLogService.findAllUserMealLogs(
            { page: null, limit: null },
            {},
            { 
                userId,
                fromDate,
                toDate
            },
        );
    
        const nutritionData = userMealLogs.reduce((acc, { nutritionData }) => {
            acc.protien += (isNaN(parseInt(nutritionData?.protien)) ? 0 : nutritionData.protien);
            acc.calories += (isNaN(parseInt(nutritionData?.calories)) ? 0 : nutritionData.calories);
            acc.fats += (isNaN(parseInt(nutritionData?.fats)) ? 0 : nutritionData.fats);
            acc.carbs += (isNaN(parseInt(nutritionData?.carbs)) ? 0 : nutritionData.carbs);
    
            return acc;
        }, { protien: 0, calories: 0, fats: 0, carbs: 0 });
    
        const averageCaloriesPerDay = daysDifference > 0 ? nutritionData.calories / daysDifference : 0;
    
        return {
            steps,
            averageStepsPerDay,
            stepsPerDay,
            sleep: 0, // Placeholder for sleep calculation
            averageSleepPerDay: 0, // Placeholder for average sleep calculation
            energy,
            averageEnergyPerDay,
            calories: nutritionData.calories,
            averageCaloriesPerDay,
            nutritionData // Corrected here as well
        };
    }

    async getActivePatients(
        fromDate?: Date,
        toDate?: Date,
    ): Promise<{
        users: {
            id: string,
            email: string,
            firstName: string,
            lastName: string,
            dob: Date,
            gender: string,
            age: number,
            onboardingCompletedAt: Date
        }[],
        count: number
    }> {
        const users = await sessionService.findAllLoggedInSessionForUsers(fromDate, toDate, ['patient']);

        return {
            count: users.length || 0,
            users: users?.map(({ id, email, firstName, lastName, dob, gender, onboardingCompletedAt }) => ({
                id, email, firstName, lastName, dob, gender, onboardingCompletedAt, age: calculateAge(dob)
            })) || [],
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

    async averageStepsPerDay(
        fromAge: number,
        toAge: number,
        fromDate: Date = new Date(new Date().setDate(1)),
        toDate: Date = new Date(new Date().setDate(new Date().getDate() - 2)),
    ) : Promise<{
        totalStepsInDate: number,
        averageStepsInDate: number,
    }> {
        const fromAgeDate = new Date(new Date().setFullYear(new Date().getFullYear() - fromAge*1));
        const toAgeDate = new Date(new Date().setFullYear(new Date().getFullYear() - toAge*1));

        const { data: users } = await userService.findAllUsers(
            { page: null, limit: null },
            {},
            {
                fromAgeDate, toAgeDate
            },
        );

        const { data: userHealthData } = await userHealthDataService.findAllUserHealthData(
            { page: null, limit: null },
            {},
            {
                userIds: users.map(({ id }) => id),
                dataType: DATA_TYPES.STEP_COUNT,
                fromDate,
                toDate
            },
        );

        const totalStepsInDate = userHealthData.reduce((acc, { value }) => acc + value, 0);
        const averageStepsInDate = totalStepsInDate / userHealthData.length;


        return {
            totalStepsInDate: Math.round(totalStepsInDate),
            averageStepsInDate: Math.round(averageStepsInDate),
        };
    }

    async getRecentEnrollements(
        fromDate: Date = new Date('01-01-1970'),
        toDate: Date = new Date(),
        gender: 'Male' | 'Female' | 'Non Binary' | null = null,
    ): Promise<{
        users: {
            id: string,
            email: string,
            firstName: string,
            lastName: string,
            dob: Date,
            gender: string,
            age: number,
            onboardingCompletedAt: Date
        }[],
        count: number
    }> {
        const filters = {} as any;
        if(gender) {
            filters.gender = gender;
        }

        const data = await userService.getRecentEnrollements(
            fromDate,
            toDate,
            filters,
        );

        return {
            count: data.count,
            users: data.users
                .map(({ id, email, firstName, lastName, dob, gender, onboardingCompletedAt }) => ({
                    id, email, firstName, lastName, dob, gender, onboardingCompletedAt, age: calculateAge(dob)
                })),
        }
    }

    async patientPerlifestylePlan(
        planId: number,
        fromDate: Date = new Date('01-01-1970'),
        toDate: Date = new Date(),
    ): Promise<{
        count: number,
        users: Array<{
            id: string,
            email: string,
            firstName: string,
            lastName: string,
            dob: Date,
            gender: string,
            age: number,
        }>
    }> {
        const data = await userPlanService.findAllUserPlans(
            { page: 1, limit: 1000 },
            {},
            {
                planId,
                fromDate,
                toDate
            },
        );
    
        return {
            count: data.totalRecords,
            users: data.data.map(({ user }) => ({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dob,
                gender: user.gender,
                age: calculateAge(user.dob),
            })),
        }
    }
}

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if the birthdate hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};
