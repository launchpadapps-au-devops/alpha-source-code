import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BaseHttpService } from 'src/common/base-http.service';
import { MessagingService } from 'src/common/messaging.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [PatientService, EnvConfigService, BaseHttpService, MessagingService],
  controllers: [PatientController],
})

export class PatientModule {}
