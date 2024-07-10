import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [StaffService, EnvConfigService, BaseHttpService, MessagingService],
  controllers: [StaffController],
})

export class StaffModule {}
