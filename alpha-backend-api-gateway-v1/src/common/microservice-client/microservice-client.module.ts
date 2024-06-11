import { Module } from '@nestjs/common';
import { MicroserviceClientService } from './microservice-client.service';
import { EnvConfigService } from '../config/envConfig.service';

@Module({
  providers: [
    MicroserviceClientService, 
    EnvConfigService
  ],
  exports: [
    MicroserviceClientService
  ]
})
export class MicroserviceClientModule {}
