import { BadRequestException, Injectable } from '@nestjs/common';
import {
    userHabitService,
    userThemeService,
    habitService
} from '@launchpadapps-au/alpha-shared';

@Injectable()
export class UserDailyHabitsService {
    constructor() { }

    async addUserDailyHabit(userId: string) {
        const existingHabits = (await userHabitService.findUserHabitsByUserId(userId))
            .filter(habit => !habit.isCompleted && (habit.status === 'ACTIVE' || habit.status === 'IN_PROGRESS'));

        const userThemes = await userThemeService.findUserThemesByUserId(userId);

        if (!userThemes?.length) {
            throw new BadRequestException('No Lifestyle Plan Assign to User');
        }

        const habits = await habitService.findHabitByThemeIds(userThemes.map(theme => theme.themeId));

        const userHabits = [];
        let currentStartDate = new Date();
        let currentTargetDate = new Date(currentStartDate.setDate(currentStartDate.getDate() + 7));
        for (const habit of habits) {
            const existingHabit = existingHabits.find(h => h.habitId === habit.id);

            if (existingHabit) {
                userHabits.push(existingHabit);
                continue;
            }

            userHabits.push({
                userId,
                userThemeId: userThemes.find(theme => theme.themeId === habit.themeId).id,
                habitId: habit.id,
                isCompleted: false,
                startedAt: currentStartDate,
                targetDate: currentTargetDate,
                pointsEarned: 0,
                createdBy: userId,
                updatedBy: userId,
            });

            currentStartDate = currentTargetDate;
            currentTargetDate = new Date(currentStartDate.setDate(currentStartDate.getDate() + 7));
        }

        await userHabitService.createUserHabits(userHabits);

        return (await userHabitService.findUserHabitsByUserId(userId))
            .filter(habit => !habit.isCompleted && (habit.status === 'ACTIVE' || habit.status === 'IN_PROGRESS'));
    }

    async getUserDailyHabitOptions(userId: string) {
        let userHabits = await userHabitService.findUserHabitsByUserId(userId);
        if (!userHabits?.length) {
            userHabits = await this.addUserDailyHabit(userId)
        }

        return userHabits.filter(habit => !habit.isCompleted && habit.status === 'ACTIVE');
    }

    async getUserDailyHabit(userId: string) {
        const userHabits = await userHabitService.findUserHabitsByUserId(userId, { status: 'IN_PROGRESS' });
        return userHabits.find(habit => !habit.isCompleted && habit.status === 'IN_PROGRESS');
    }

    async selectUserDailyHabits(userId: string, habitIds: string[], reqUser = { userId: null }) {
        const userHabits = await userHabitService.findUserHabitsByUserId(userId);
        const inProgressHabits = userHabits.filter(habit => habit.status === 'IN_PROGRESS');

        if (inProgressHabits.length > 4) {
            throw new BadRequestException('Already 4 habits in progress');
        }

        if (habitIds.length > 4) {
            throw new BadRequestException('Cannot select more than 4 habits');
        }

        if (habitIds.length + inProgressHabits.length > 4) {
            throw new BadRequestException('Cannot select more than 4 habits');
        }

        const selctedUserHabit = [];
        try {
            for (const habitId of habitIds) {
                const userHabit = userHabits.find(habit => habit.id === habitId);

                if (!userHabit) {
                    throw new BadRequestException('Habit not found');
                }

                userHabit.status = 'IN_PROGRESS';
                userHabit.updatedBy = reqUser.userId;

                selctedUserHabit.push(userHabit);
            }
        }
        catch (error) {
            console.log(error);
        }

        await userHabitService.updateUserHabits(selctedUserHabit);
    }

    async completeUserDailyHabit(userHabitId: string, reqUser = { userId: null }) {
        const userHabit = await userHabitService.findUserHabitById(userHabitId);

        if (userHabit.isCompleted) {
            throw new BadRequestException('Habit already completed');
        }

        userHabit.isCompleted = true;
        userHabit.pointsEarned = userHabit.habit.pointAllocation;
        userHabit.completedAt = new Date();
        userHabit.updatedBy = reqUser.userId;

        await userHabitService.updateUserHabit(userHabitId, userHabit);
    }
}
