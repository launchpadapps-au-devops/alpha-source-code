import { Module } from '@nestjs/common';
import { MicroserviceClientModule } from './microservice-client/microservice-client.module';

@Module({
  imports: [
    MicroserviceClientModule,
  ]
})
export class CommonModule {}
