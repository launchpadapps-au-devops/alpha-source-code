import { Module } from '@nestjs/common';
import { UserMealController } from './user-meal.controller';
import { UserMealService } from './user-meal.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [UserMealController],
  providers: [UserMealService, EnvConfigService, BaseHttpService, MessagingService]
})
export class UserMealModule {}
