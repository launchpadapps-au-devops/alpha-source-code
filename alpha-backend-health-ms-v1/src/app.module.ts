import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseHttpService } from './common/base-http.service';
import { MessagingService } from './common/messaging.service';
import { EnvConfigService } from './common/config/envConfig.service';
import { HealthDataModule } from './health-data/health-data.module';
import { UserLifeStylePlanModule } from './user-lifestyle-plan/user-lifestyle-plan.module';
import { UserDailyHabitsModule } from './user-daily-habits/user-daily-habits.module';
import { UserMealModule } from './user-meal/user-meal.module';
import { DataAnalyticModule } from './data-analytics/data-analytics.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    HealthDataModule, 
    UserLifeStylePlanModule, 
    UserDailyHabitsModule,
    UserMealModule,
    DataAnalyticModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    BaseHttpService, 
    MessagingService,
    EnvConfigService
  ],
})
export class AppModule {}
