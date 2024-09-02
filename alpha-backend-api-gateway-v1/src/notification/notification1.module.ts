import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';
import { NotificationController } from './notification.controller';


@Module({
  imports: [ConfigModule, HttpModule],
  providers: [NotificationService, EnvConfigService, BaseHttpService, MessagingService],
  controllers: [NotificationController]
})

export class LessonModule {}
