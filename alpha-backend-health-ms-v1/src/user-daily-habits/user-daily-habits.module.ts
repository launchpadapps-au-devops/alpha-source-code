import { Module } from '@nestjs/common';
import { UserDailyHabitsService } from './user-daily-habits.service';
import { UserDailyHabitsController } from './user-daily-habits.controller';

@Module({
  providers: [UserDailyHabitsService],
  controllers: [UserDailyHabitsController]
})
export class UserDailyHabitsModule {}
