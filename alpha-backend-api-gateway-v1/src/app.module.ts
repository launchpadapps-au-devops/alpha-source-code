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

@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    PatientModule, 
    NotificationModule, AuthModule, PolicyModule, HealthDataModule,
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
