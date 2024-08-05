import { Body, Controller, Get, Headers, Put } from '@nestjs/common';
import { UserDailyHabitsService } from './user-daily-habits.service';

@Controller('user-daily-habits')
export class UserDailyHabitsController {
    constructor(private readonly userDailyHabitsService: UserDailyHabitsService) { }

    @Get('options')
    async getUserDailyHabitOptions(
        @Headers('x-request-userId') reqUserId: string,
    ) {
        const userHabits = await this.userDailyHabitsService.getUserDailyHabitOptions(reqUserId);
        return {
            message: 'User Habits Options Fetched Successfully',
            data: userHabits,
            meta: {}
        }
    }

    @Get('current')
    async getUserDailyHabit(
        @Headers('x-request-userId') reqUserId: string,
    ) {
        const userDailyHabits = await this.userDailyHabitsService.getUserDailyHabit(reqUserId);
        return {
            message: 'User Habits Fetched Successfully',
            data: userDailyHabits,
            meta: {},
        }
    }

    @Put('select')
    async selectUserDailyHabits(
        @Headers('x-request-userId') userId: string,
        @Body() habitIds: string[],
    ) {
        await this.userDailyHabitsService.selectUserDailyHabits(userId, habitIds, { userId });
        return {
            message: 'User Habits Selected Successfully',
            data: {},
            meta: {},
        }
    }

    @Put('complete')
    async completeUserDailyHabit(
        @Headers('x-request-userId') reqUserId: string,
        userHabitId: string,
    ) {
        await this.userDailyHabitsService.completeUserDailyHabit(userHabitId, { userId: reqUserId });
        return {
            message: 'User Habit Completed Successfully',
            data: {},
            meta: {},
        }
    }
}
