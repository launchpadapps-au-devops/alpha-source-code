import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfigModule } from '@nestjs/config';
import { EnvConfigService } from './envConfig.service';

@Module({
  imports: [NestConfigModule.forRoot({
    isGlobal: true,
  })],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class ConfigModule {}
