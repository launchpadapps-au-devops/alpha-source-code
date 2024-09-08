import { Module } from '@nestjs/common';

import { EmailHandler } from './email.handler';
import { ConfigModule } from '@nestjs/config';
import { EnvConfigService } from 'src/common/config/envConfig.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailHandler, EnvConfigService],
  exports: [EmailHandler],
})

export class EmailModule {}
