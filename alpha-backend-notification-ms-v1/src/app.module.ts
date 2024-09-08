import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigService } from './common/config/envConfig.service';
import { EmailModule } from './email/email.module';
import { HandlerModule } from './handler/handler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    EmailModule,
    HandlerModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    EnvConfigService
  ],
})

export class AppModule {}
