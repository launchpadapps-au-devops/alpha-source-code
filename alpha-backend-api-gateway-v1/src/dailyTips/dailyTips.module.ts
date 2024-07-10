import { Module } from '@nestjs/common';
import { DailyTipController } from './dailyTips.controller';
import { DailyTipsService } from './dailyTips.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { BaseHttpService } from 'src/common/base-http.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [DailyTipController],
  providers: [DailyTipsService, EnvConfigService, BaseHttpService]
})

export class DailyTipsModule {}


