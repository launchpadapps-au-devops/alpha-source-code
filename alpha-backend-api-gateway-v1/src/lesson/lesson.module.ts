import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';


@Module({
  imports: [ConfigModule, HttpModule],
  providers: [LessonService, EnvConfigService, BaseHttpService, MessagingService],
  controllers: [LessonController]
})

export class LessonModule {}
