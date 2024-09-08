import { BadRequestException, Injectable } from '@nestjs/common';
import { MessagingService } from 'src/common/messaging.service';
import {
    userHabitService,
    userThemeService,
    habitService,
    UserHabitProgress,
    NotificationType,
    userService
} from '@launchpadapps-au/alpha-shared';

@Injectable()
export class UserDailyHabitsService {
    constructor(
        private readonly messagingService: MessagingService,
    ) { }

    async addUserDailyHabit(userId: string) {
        const existingHabits = (await userHabitService.findUserHabitsByUserId(userId))
            .filter(habit => !habit.isCompleted && (habit.status === 'ACTIVE' || habit.status === 'IN_PROGRESS' || habit.status === 'CURRENT_SELECTED'));

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
        return userHabits.filter(habit => !habit.isCompleted && habit.status === 'IN_PROGRESS');
    }

    async selectUserDailyHabits(userId: string, habitIds: string[], reqUser = { userId: null }) {
        const userHabits = await userHabitService.findUserHabitsByUserId(userId);
        const inProgressHabits = userHabits.filter(habit => habit.status === 'CURRENT_SELECTED');

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

    async startUserDailyHabit(userHabitId: string, reqUser = { userId: null }) {
        const userHabit = await userHabitService.findUserHabitById(userHabitId);

        const weekTimeAllocation = userHabit.habit.timeAllocation;

        const userHabitProgresses = [] as UserHabitProgress[];
        for(let i = 1; i <= weekTimeAllocation; i++) {
          for(let j = 1; j <= 7; j++) {

            const userHabitProgress = {} as UserHabitProgress;
            userHabitProgress.userHabitId = userHabitId;
            userHabitProgress.day = j;
            userHabitProgress.week = i;
            userHabitProgress.status = 'ACTIVE';
            userHabitProgress.date = new Date();
            userHabitProgress.startedAt = new Date();
            userHabitProgress.targetDate = new Date();
            userHabitProgress.pointsEarned = 0;

            userHabitProgresses.push(userHabitProgress);
          }
        };

        userHabit.status = 'IN_PROGRESS';
        userHabit.updatedBy = reqUser.userId;

        await userHabitService.updateUserHabit(userHabitId, userHabit);
    }

    async markUserDailyHabitProgressAsComplete(userHabitProgressId: string, reqUser = { userId: null }) {
        const userHabitProgress = await userHabitService.findUserHabitProgressById(userHabitProgressId);
        const user = await userService.findUserById(userHabitProgress.userId);
        if (userHabitProgress.isCompleted) {
            throw new BadRequestException('Habit already completed');
        }

        userHabitProgress.isCompleted = true;
        userHabitProgress.completedAt = new Date();
        userHabitProgress.updatedBy = reqUser.userId;

        await userHabitService.updateUserHabitProgress(userHabitProgressId, userHabitProgress);

        this.messagingService.publishToNotification(
            'notification.register',
            {
                userId: userHabitProgress.userId,
                recipients: [userHabitProgress.userId],
                type: NotificationType.PUSH,
                categoryId: 5, // PROGRESS_MILESTONE
                subcategoryId: 17, // THEME_COMPLETED
                data: {
                    firstName: user.firstName || user.name,
                    habitId: userHabitProgress.userHabit.habitId,
                    habitName: userHabitProgress.userHabit.habit.name,
                    points: userHabitProgress.userHabit.habit.pointAllocation,
                }
            }
        )

        const userHabitProgresses = await userHabitService.findUserHabitProgressByUserHabitId(userHabitProgress.userHabitId);
        
        const isAllProgressCompleted = userHabitProgresses.every(progress => progress.isCompleted);
        if (isAllProgressCompleted) {
            await this.completeUserDailyHabit(userHabitProgress.userHabitId, reqUser);
        }

        const updatedUserHabit = await userHabitService.findUserHabitById(userHabitProgress.userHabitId);

        return {
            userHabitProgress: {
                id: userHabitProgress.id,
                isCompleted: userHabitProgress.isCompleted,
            },
            userHabit: {
                id: updatedUserHabit.id,
                isCompleted: updatedUserHabit.isCompleted,
                totalPracticedDays: userHabitProgresses.filter(progress => progress.isCompleted).length,
                remainingDays: userHabitProgresses.filter(progress => !progress.isCompleted).length,
                totalDays: userHabitProgresses.length,
            }
        }

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
