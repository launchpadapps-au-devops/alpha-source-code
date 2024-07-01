import { Module } from '@nestjs/common';
import { HealthDataService } from './health-data.service';
import { HealthDataController } from './health-data.controller';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [HealthDataService, EnvConfigService, BaseHttpService, MessagingService],
  controllers: [HealthDataController],
})

export class HealthDataModule {}
