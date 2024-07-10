import { Module } from '@nestjs/common';
import { DailyTipController } from './dailyTip.controller';
import { DailyTipsService } from './dailyTip.service';

@Module({
  controllers: [DailyTipController],
  providers: [DailyTipsService]
})

export class DailyTipModule {}
