import { Module } from '@nestjs/common';
import { UserDailyHabitsController } from './user-daily-habits.controller';
import { UserDailyHabitsService } from './user-daily-habits.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [UserDailyHabitsController],
  providers: [UserDailyHabitsService, EnvConfigService, BaseHttpService, MessagingService]
})
export class UserDailyHabitsModule {}
