import { Module } from '@nestjs/common';
import { DataAnalyticController } from './data-analytics.controller';
import { DataAnalyticService } from './data-analytics.service';

@Module({
  controllers: [DataAnalyticController],
  providers: [DataAnalyticService],
})
export class DataAnalyticModule {}
