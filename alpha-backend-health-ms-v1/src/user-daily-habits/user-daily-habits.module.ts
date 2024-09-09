import { Module } from '@nestjs/common';
import { UserDailyHabitsService } from './user-daily-habits.service';
import { UserDailyHabitsController } from './user-daily-habits.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [UserDailyHabitsService, EnvConfigService, MessagingService],
  controllers: [UserDailyHabitsController]
})
export class UserDailyHabitsModule {}
