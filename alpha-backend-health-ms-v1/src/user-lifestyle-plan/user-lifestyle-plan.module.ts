import { Module } from '@nestjs/common';
import { UserLifeStylePlanService } from './user-lifestyle-plan.service';
import { UserLifestylePlanController } from './user-lifestyle-plan.controller';

@Module({
  providers: [UserLifeStylePlanService],
  controllers: [UserLifestylePlanController]
})
export class UserLifeStylePlanModule {}
