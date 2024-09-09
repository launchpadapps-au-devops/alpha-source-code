import { Module } from '@nestjs/common';
import { UserLifeStylePlanService } from './user-lifestyle-plan.service';
import { UserLifestylePlanController } from './user-lifestyle-plan.controller';
import { MessagingService } from 'src/common/messaging.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [UserLifeStylePlanService, MessagingService, EnvConfigService],
  controllers: [UserLifestylePlanController]
})
export class UserLifeStylePlanModule {}
