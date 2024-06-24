import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigService } from './common/config/envConfig.service';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmailModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    EnvConfigService
  ],
})
export class AppModule {}
