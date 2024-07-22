import { Module } from '@nestjs/common';
import { UserLifeStylePlanController } from './user-lifestyle-plan.controller';
import { UserLifeStylePlanService } from './user-lifestyle-plan.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';


@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [UserLifeStylePlanController],
  providers: [UserLifeStylePlanService, EnvConfigService, BaseHttpService, MessagingService],
})
export class UserLifestylePlanModule {}
