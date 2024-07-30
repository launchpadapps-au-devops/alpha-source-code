import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseHttpService } from './common/base-http.service';
import { MessagingService } from './common/messaging.service';
import { EnvConfigService } from './common/config/envConfig.service';
import { PatientModule } from './patient/patient.module';
import { NotificationModule } from './notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { PolicyModule } from './policy/policy.module';
import { HealthDataService } from './health-data/health-data.service';
import { HealthDataModule } from './health-data/health-data.module';
import { CategoryModule } from './category/category.module';
import { ThemeModule } from './theme/theme.module';
import { LessonModule } from './lesson/lesson.module';
import { DailyTipsModule } from './dailyTips/dailyTips.module';
import { StaffModule } from './staff/staff.module';
import { PlanModule } from './plan/plan.module';
import { UserLifestylePlanModule } from './user-lifestyle-plan/user-lifestyle-plan.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { UserDailyHabitsModule } from './user-daily-habits/user-daily-habits.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    PatientModule, 
    NotificationModule, 
    AuthModule, 
    PolicyModule, 
    HealthDataModule, 
    CategoryModule, 
    ThemeModule, 
    LessonModule, 
    DailyTipsModule,
    StaffModule,
    PlanModule,
    UserLifestylePlanModule,
    FileUploadModule,
    UserDailyHabitsModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    BaseHttpService, 
    MessagingService,
    EnvConfigService,
    HealthDataService
  ],
})
export class AppModule {}
