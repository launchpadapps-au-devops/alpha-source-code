import { Module } from '@nestjs/common';
import { UserMealService } from './user-meal.service';
import { UserMealController } from './user-meal.controller';

@Module({
  providers: [UserMealService],
  controllers: [UserMealController],
})
export class UserMealModule {}
