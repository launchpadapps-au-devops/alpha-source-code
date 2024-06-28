import { Module } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { EnvConfigService } from 'src/common/config/envConfig.service';
import { BaseHttpService } from 'src/common/base-http.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [PolicyController],
  providers: [PolicyService, EnvConfigService, BaseHttpService]
})
export class PolicyModule {}
