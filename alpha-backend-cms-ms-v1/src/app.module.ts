import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseHttpService } from './common/base-http.service';
import { MessagingService } from './common/messaging.service';
import { EnvConfigService } from './common/config/envConfig.service';
import { PolicyModule } from './policy/policy.module';
import { CategoryModule } from './category/category.module';
import { ThemeModule } from './theme/theme.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    PolicyModule, CategoryModule, ThemeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    BaseHttpService, 
    MessagingService,
    EnvConfigService
  ],
})
export class AppModule {}
