import { Module } from '@nestjs/common';
import { DataAnalyticService } from './data-analytics.service';
import { DataAnalyticController } from './data-analytics.controller';

import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [DataAnalyticService, EnvConfigService, BaseHttpService, MessagingService],
  controllers: [DataAnalyticController],
})

export class DataAnalyticsModule {}
